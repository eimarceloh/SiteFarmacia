import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendOrderConfirmation } from "@/lib/email"
import { pagarmeConfigurado, PagarmeError } from "@/lib/pagarme/client"
import { criarCobranca, type MetodoPagamento } from "@/lib/pagarme/orders"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = createClient<any>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

const FREE_SHIPPING_THRESHOLD = 199
const SHIPPING_COST = 15.9

type CartItemPayload = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

type CreateOrderBody = {
  nome: string
  email: string
  telefone: string
  cpf: string
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  forma_pagamento: string   // "cartao" | "pix" | "boleto"
  card_token?: string       // token do cartão (tokenizado no navegador)
  parcelas?: number
  items: CartItemPayload[]
}

const METODO_MAP: Record<string, MetodoPagamento> = {
  cartao: "credit_card",
  credit_card: "credit_card",
  pix: "pix",
  boleto: "boleto",
}

export async function POST(request: Request) {
  let body: CreateOrderBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 })
  }

  const {
    nome, email, telefone, cpf, cep, logradouro, numero, complemento,
    bairro, cidade, estado, forma_pagamento, card_token, parcelas, items,
  } = body

  if (!nome || !email || !items?.length) {
    return NextResponse.json({ error: "Dados obrigatórios ausentes." }, { status: 400 })
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const frete = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + frete
  const numeroPedido = `FP-${Date.now().toString().slice(-8)}`
  const metodo = METODO_MAP[forma_pagamento] ?? "pix"

  // Insere pedido + itens no banco. Retorna o id (ou null em caso de erro).
  async function salvarPedido(extra: Record<string, unknown>): Promise<string | null> {
    const { data: pedido, error } = await db
      .from("pedidos")
      .insert({
        numero_pedido: numeroPedido,
        nome_cliente: nome,
        email_cliente: email,
        telefone_cliente: telefone || null,
        cpf_cliente: cpf || null,
        entrega_logradouro: logradouro,
        entrega_numero: numero,
        entrega_complemento: complemento || null,
        entrega_bairro: bairro,
        entrega_cidade: cidade,
        entrega_estado: estado,
        entrega_cep: cep,
        forma_pagamento,
        status: "confirmado",
        subtotal,
        frete,
        total_desconto: 0,
        total,
        ...extra,
      })
      .select("id")
      .single()

    if (error) {
      console.error("[pedidos] Erro ao salvar pedido:", error)
      return null
    }

    await db.from("itens_pedido").insert(
      items.map((item) => ({
        pedido_id: pedido.id,
        produto_id: null,
        nome_produto: item.name,
        imagem_produto: item.image ?? null,
        slug_produto: item.id,
        quantidade: item.quantity,
        preco_unitario: item.price,
        preco_total: item.price * item.quantity,
      })),
    )
    return pedido.id as string
  }

  function enviarEmail() {
    sendOrderConfirmation({
      to: email, nome, numeroPedido, items, subtotal, frete, total,
      enderecoEntrega: { logradouro, numero, complemento: complemento ?? null, bairro, cidade, estado, cep },
      formaPagamento: forma_pagamento,
    }).catch((err) => console.error("[pedidos] Falha no e-mail:", err))
  }

  // ── Sem gateway configurado: mantém o comportamento antigo (pedido pendente) ──
  if (!pagarmeConfigurado()) {
    const id = await salvarPedido({ status_pagamento: "pendente" })
    if (!id) return NextResponse.json({ error: "Erro ao salvar pedido." }, { status: 500 })
    enviarEmail()
    return NextResponse.json({ numeroPedido, total, status_pagamento: "pendente" })
  }

  // ── Com Pagar.me ──────────────────────────────────────────────────────────────
  if (metodo === "credit_card" && !card_token) {
    return NextResponse.json({ error: "Dados do cartão ausentes." }, { status: 400 })
  }

  const itensCobranca = [
    ...items.map((i) => ({ descricao: i.name, valorCentavos: Math.round(i.price * 100), quantidade: i.quantity })),
    ...(frete > 0 ? [{ descricao: "Frete", valorCentavos: Math.round(frete * 100), quantidade: 1 }] : []),
  ]

  let cobranca
  try {
    cobranca = await criarCobranca({
      codigoPedido: numeroPedido,
      metodo,
      itens: itensCobranca,
      cliente: { nome, email, documento: cpf, telefone },
      cardToken: card_token,
      parcelas,
    })
  } catch (e) {
    const msg = e instanceof PagarmeError ? e.message : "Falha ao processar o pagamento."
    console.error("[pedidos] Pagar.me:", e)
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  // Cartão recusado → não cria pedido
  if (metodo === "credit_card" && !cobranca.pago) {
    return NextResponse.json(
      { error: cobranca.motivoFalha ?? "Pagamento não autorizado. Verifique os dados do cartão." },
      { status: 402 },
    )
  }

  const statusPagamento = cobranca.pago ? "pago" : "pendente"
  const id = await salvarPedido({
    status_pagamento: statusPagamento,
    pagarme_pedido_id: cobranca.pagarmeId || null,
    pagamento_qr_code: cobranca.pix?.qrCode ?? null,
    pagamento_qr_code_url: cobranca.pix?.qrCodeUrl ?? null,
    pagamento_boleto_url: cobranca.boleto?.url ?? null,
    pagamento_linha_digitavel: cobranca.boleto?.linhaDigitavel ?? null,
  })
  if (!id) return NextResponse.json({ error: "Pagamento processado, mas houve erro ao registrar o pedido." }, { status: 500 })

  enviarEmail()

  return NextResponse.json({
    numeroPedido,
    total,
    status_pagamento: statusPagamento,
    metodo,
    pix: cobranca.pix ?? null,
    boleto: cobranca.boleto ?? null,
  })
}
