import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendOrderConfirmation } from "@/lib/email"

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
  forma_pagamento: string
  items: CartItemPayload[]
}

export async function POST(request: Request) {
  let body: CreateOrderBody

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 })
  }

  const { nome, email, telefone, cpf, cep, logradouro, numero, complemento, bairro, cidade, estado, forma_pagamento, items } = body

  if (!nome || !email || !items?.length) {
    return NextResponse.json({ error: "Dados obrigatórios ausentes." }, { status: 400 })
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const frete = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + frete
  const numeroPedido = `FP-${Date.now().toString().slice(-8)}`

  // Salva o pedido
  const { data: pedido, error: pedidoError } = await db
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
      status_pagamento: "pendente",
      status: "confirmado",
      subtotal,
      frete,
      total_desconto: 0,
      total,
    })
    .select("id")
    .single()

  if (pedidoError) {
    console.error("[pedidos] Erro ao salvar pedido:", pedidoError)
    return NextResponse.json({ error: "Erro ao salvar pedido." }, { status: 500 })
  }

  // Salva os itens
  const { error: itensError } = await db.from("itens_pedido").insert(
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

  if (itensError) {
    console.error("[pedidos] Erro ao salvar itens:", itensError)
    // Pedido já foi criado; não retorna erro ao cliente, só loga
  }

  // Envia e-mail de confirmação (não bloqueia se falhar)
  sendOrderConfirmation({
    to: email,
    nome,
    numeroPedido,
    items,
    subtotal,
    frete,
    total,
    enderecoEntrega: { logradouro, numero, complemento: complemento ?? null, bairro, cidade, estado, cep },
    formaPagamento: forma_pagamento,
  }).catch((err) => console.error("[pedidos] Falha no e-mail:", err))

  return NextResponse.json({ numeroPedido, total })
}
