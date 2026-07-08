import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = createClient<any>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

// Mapeia o evento do Pagar.me → status_pagamento no nosso banco
function mapStatusPagamento(tipo: string): string | null {
  if (tipo === "order.paid" || tipo === "charge.paid") return "pago"
  if (tipo === "charge.payment_failed") return "falhou"
  if (tipo === "charge.refunded" || tipo === "order.canceled") return "estornado"
  return null
}

export async function POST(request: Request) {
  // Verificação opcional por segredo compartilhado (Basic auth configurado no painel)
  const secret = process.env.PAGARME_WEBHOOK_SECRET
  if (secret) {
    const auth = request.headers.get("authorization")
    const esperado = "Basic " + Buffer.from(secret).toString("base64")
    if (auth !== esperado && auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 })
  }

  const tipo: string = payload?.type ?? ""
  const novoStatus = mapStatusPagamento(tipo)
  if (!novoStatus) {
    // Evento que não tratamos — responde 200 para o Pagar.me não reenviar
    return NextResponse.json({ ok: true, ignorado: tipo })
  }

  // O objeto pode ser um order ou um charge. Tentamos achar o pedido por:
  //  - code (numero_pedido, que enviamos ao criar a ordem)
  //  - order id (pagarme_pedido_id)
  const data = payload?.data ?? {}
  const code: string | undefined = data?.code ?? data?.order?.code
  const orderId: string | undefined = data?.id ?? data?.order?.id

  let query = db.from("pedidos").update({ status_pagamento: novoStatus })
  if (code) query = query.eq("numero_pedido", code)
  else if (orderId) query = query.eq("pagarme_pedido_id", orderId)
  else return NextResponse.json({ error: "Pedido não identificado no evento." }, { status: 422 })

  const { error } = await query
  if (error) {
    console.error("[webhook pagarme] erro ao atualizar pedido:", error)
    return NextResponse.json({ error: "Erro ao atualizar pedido." }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
