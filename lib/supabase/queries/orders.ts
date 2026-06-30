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
