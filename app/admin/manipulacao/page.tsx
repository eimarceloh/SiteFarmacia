import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getOrdersByStatus } from "@/lib/supabase/queries/orders"
import { usuarioTemPermissao } from "@/lib/rbac/verificar"
import { ManipulacaoBoard, type ManipulacaoOrder } from "@/components/admin/manipulacao-board"

export const metadata: Metadata = { title: "Manipulação" }
export const dynamic = "force-dynamic"

export default async function ManipulacaoPage() {
  const [pode, podeAtualizar] = await Promise.all([
    usuarioTemPermissao("manipulacao.ver"),
    usuarioTemPermissao("manipulacao.atualizar"),
  ])
  if (!pode) redirect("/acesso-negado")

  let orders: ManipulacaoOrder[] = []
  try {
    const rows = await getOrdersByStatus(supabaseAdmin, "manipulacao")
    orders = rows.map((o) => ({
      id: o.id,
      numero_pedido: o.numero_pedido,
      nome_cliente: o.nome_cliente,
      criado_em: o.criado_em,
      total: Number(o.total),
      itens_pedido: (o.itens_pedido ?? []).map((i) => ({
        id: i.id, nome_produto: i.nome_produto, quantidade: i.quantidade,
      })),
    }))
  } catch {
    // Supabase indisponível — fila vazia
  }

  return <ManipulacaoBoard orders={orders} podeAtualizar={podeAtualizar} />
}
