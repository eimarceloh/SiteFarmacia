import type { SupabaseClient } from "@supabase/supabase-js"
import type {
  Order, OrderWithItems, NewOrder, NewOrderItem, OrderStatus
} from "../types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = SupabaseClient<any>

// Criar pedido completo (pedido + itens) — usar supabaseAdmin
export async function createOrder(
  db: DB,
  order: NewOrder,
  items: Omit<NewOrderItem, "pedido_id">[],
): Promise<Order> {
  const { data: newOrder, error: orderError } = await db
    .from("pedidos")
    .insert(order)
    .select()
    .single()

  if (orderError) throw orderError

  const orderItems = items.map((item) => ({ ...item, pedido_id: (newOrder as Order).id }))

  const { error: itemsError } = await db.from("itens_pedido").insert(orderItems)
  if (itemsError) throw itemsError

  // Registra status inicial no histórico (o trigger também fará isso, mas garantimos aqui)
  await db.from("historico_pedidos").insert({
    pedido_id: (newOrder as Order).id,
    status: "confirmado",
    rotulo: "Pedido confirmado",
  })

  return newOrder as Order
}

// Pedido por número (para confirmação e rastreio)
export async function getOrderByNumber(db: DB, orderNumber: string): Promise<OrderWithItems | null> {
  const { data, error } = await db
    .from("pedidos")
    .select("*, itens_pedido(*)")
    .eq("numero_pedido", orderNumber)
    .single()

  if (error) return null
  return data as OrderWithItems
}

// Pedidos do cliente logado
export async function getCustomerOrders(db: DB, customerId: string): Promise<OrderWithItems[]> {
  const { data, error } = await db
    .from("pedidos")
    .select("*, itens_pedido(*)")
    .eq("cliente_id", customerId)
    .order("criado_em", { ascending: false })

  if (error) throw error
  return data as OrderWithItems[]
}

// Admin: todos os pedidos com paginação e filtro por status
export async function getAllOrders(
  db: DB,
  { page = 1, limit = 20, status }: { page?: number; limit?: number; status?: OrderStatus } = {},
): Promise<{ orders: OrderWithItems[]; total: number }> {
  let query = db
    .from("pedidos")
    .select("*, itens_pedido(*)", { count: "exact" })
    .order("criado_em", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (status) query = query.eq("status", status)

  const { data, count, error } = await query
  if (error) throw error
  return { orders: data as OrderWithItems[], total: count ?? 0 }
}

// Admin: atualizar status do pedido (trigger registra histórico automaticamente)
export async function updateOrderStatus(
  db: DB,
  orderId: string,
  status: OrderStatus,
  extras?: { codigo_rastreio?: string; previsao_entrega?: string; observacoes?: string },
): Promise<Order> {
  const { data, error } = await db
    .from("pedidos")
    .update({ status, ...extras })
    .eq("id", orderId)
    .select()
    .single()

  if (error) throw error
  return data as Order
}

// Histórico de status (timeline de rastreio)
export async function getOrderStatusHistory(db: DB, orderId: string) {
  const { data, error } = await db
    .from("historico_pedidos")
    .select("*")
    .eq("pedido_id", orderId)
    .order("criado_em", { ascending: true })

  if (error) throw error
  return data
}

// Muda o status do pedido E registra o histórico com o executor (criado_por).
// Fonte única de mudança de status — usada por todas as Server Actions.
// (o gatilho automático de histórico foi removido na migração 005)
export async function mudarStatusPedido(
  db: DB,
  params: {
    pedidoId: string
    novoStatus: OrderStatus
    rotulo: string
    criadoPor: string | null
    observacao?: string
  },
): Promise<void> {
  const { pedidoId, novoStatus, rotulo, criadoPor, observacao } = params

  const { error: upErr } = await db
    .from("pedidos")
    .update({ status: novoStatus })
    .eq("id", pedidoId)
  if (upErr) throw upErr

  const { error: histErr } = await db.from("historico_pedidos").insert({
    pedido_id: pedidoId,
    status: novoStatus,
    rotulo,
    observacao: observacao ?? null,
    criado_por: criadoPor,
  })
  if (histErr) throw histErr
}

export type OrderDetail = {
  order: OrderWithItems
  history: Array<{
    id: string
    status: string
    rotulo: string
    observacao: string | null
    criado_em: string
    autor_nome: string | null
  }>
  receitaStatus: string | null
}

// Detalhe completo do pedido para a esteira de produção:
// pedido + itens + histórico (com nome do executor) + status da receita vinculada.
export async function getOrderDetail(db: DB, orderId: string): Promise<OrderDetail | null> {
  const { data: order, error } = await db
    .from("pedidos")
    .select("*, itens_pedido(*)")
    .eq("id", orderId)
    .single()
  if (error || !order) return null

  const { data: hist } = await db
    .from("historico_pedidos")
    .select("*")
    .eq("pedido_id", orderId)
    .order("criado_em", { ascending: true })

  const historico = (hist ?? []) as Array<{
    id: string; status: string; rotulo: string; observacao: string | null
    criado_em: string; criado_por: string | null
  }>

  // Resolve os nomes dos executores (criado_por → clientes.nome_completo)
  const autorIds = [...new Set(historico.map((h) => h.criado_por).filter(Boolean))] as string[]
  const nomes = new Map<string, string>()
  if (autorIds.length > 0) {
    const { data: autores } = await db
      .from("clientes")
      .select("id, nome_completo")
      .in("id", autorIds)
    for (const a of (autores ?? []) as Array<{ id: string; nome_completo: string | null }>) {
      if (a.nome_completo) nomes.set(a.id, a.nome_completo)
    }
  }

  const { data: receita } = await db
    .from("receitas")
    .select("status")
    .eq("pedido_id", orderId)
    .maybeSingle()

  return {
    order: order as OrderWithItems,
    history: historico.map((h) => ({
      id: h.id,
      status: h.status,
      rotulo: h.rotulo,
      observacao: h.observacao,
      criado_em: h.criado_em,
      autor_nome: h.criado_por ? nomes.get(h.criado_por) ?? null : null,
    })),
    receitaStatus: (receita as { status: string } | null)?.status ?? null,
  }
}

// Admin: lista completa de pedidos com itens (para a tabela de gestão)
export async function getAdminOrders(db: DB): Promise<OrderWithItems[]> {
  const { data, error } = await db
    .from("pedidos")
    .select("*, itens_pedido(*)")
    .order("criado_em", { ascending: false })

  if (error) throw error
  return (data ?? []) as OrderWithItems[]
}

// Admin: pedidos por status (fila de manipulação, atendimento, etc.)
export async function getOrdersByStatus(db: DB, status: OrderStatus): Promise<OrderWithItems[]> {
  const { data, error } = await db
    .from("pedidos")
    .select("*, itens_pedido(*)")
    .eq("status", status)
    .order("criado_em", { ascending: true })

  if (error) throw error
  return (data ?? []) as OrderWithItems[]
}

// Admin: dados agregados para o dashboard (KPIs, receita semanal, top produtos)
export async function getDashboardData(db: DB) {
  const orders = await getAdminOrders(db)
  const validos = orders.filter((o) => o.status !== "cancelado")

  const totalRevenue = validos.reduce((s, o) => s + Number(o.total), 0)
  const totalOrders = validos.length
  const pending = validos.filter((o) => o.status !== "entregue").length

  // Receita das últimas 8 semanas (buckets de 7 dias até hoje)
  const agora = Date.now()
  const semana = 7 * 24 * 60 * 60 * 1000
  const weeklyRevenue = Array.from({ length: 8 }, (_, i) => {
    const fim = agora - (7 - i) * semana
    const inicio = fim - semana
    const value = validos
      .filter((o) => {
        const t = new Date(o.criado_em).getTime()
        return t >= inicio && t < fim
      })
      .reduce((s, o) => s + Number(o.total), 0)
    return {
      label: new Date(inicio).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      value,
    }
  })

  // Top produtos por número de vendas (soma de quantidade nos itens)
  const porProduto = new Map<string, { name: string; sales: number; revenue: number }>()
  for (const o of validos) {
    for (const item of o.itens_pedido ?? []) {
      const atual = porProduto.get(item.nome_produto) ?? { name: item.nome_produto, sales: 0, revenue: 0 }
      atual.sales += item.quantidade
      atual.revenue += Number(item.preco_total)
      porProduto.set(item.nome_produto, atual)
    }
  }
  const topProducts = [...porProduto.values()].sort((a, b) => b.sales - a.sales).slice(0, 5)

  return {
    totalRevenue,
    totalOrders,
    avgTicket: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    pending,
    weeklyRevenue,
    topProducts,
    recentOrders: orders.slice(0, 6),
  }
}

// Métricas para o dashboard
export async function getOrderMetrics(db: DB) {
  const { data, error } = await db
    .from("pedidos")
    .select("total, status, criado_em, forma_pagamento")
    .not("status", "eq", "cancelado")

  if (error) throw error

  const rows = data as Array<{ total: number; status: string; criado_em: string; forma_pagamento: string }>
  const totalRevenue = rows.reduce((s, o) => s + o.total, 0)
  const totalOrders = rows.length
  const pending = rows.filter((o) => o.status !== "entregue").length

  return {
    totalRevenue,
    totalOrders,
    avgTicket: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    pendingOrders: pending,
    orders: rows,
  }
}
