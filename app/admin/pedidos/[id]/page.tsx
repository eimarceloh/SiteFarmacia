import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getOrderDetail } from "@/lib/supabase/queries/orders"
import { minhasPermissoes } from "@/lib/rbac/verificar"
import { OrderPipeline, type PipelineOrder } from "@/components/admin/order-pipeline"

export const metadata: Metadata = { title: "Pedido" }
export const dynamic = "force-dynamic"

export default async function PedidoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const permissoes = await minhasPermissoes()
  // Quem enxerga a esteira: quem vê todos os pedidos ou trabalha na manipulação
  const podeVer = permissoes.includes("pedido.ver_todos") || permissoes.includes("manipulacao.ver")
  if (!podeVer) redirect("/acesso-negado")

  const detalhe = await getOrderDetail(supabaseAdmin, id)
  if (!detalhe) notFound()

  const order: PipelineOrder = {
    id: detalhe.order.id,
    numero_pedido: detalhe.order.numero_pedido,
    nome_cliente: detalhe.order.nome_cliente,
    email_cliente: detalhe.order.email_cliente,
    criado_em: detalhe.order.criado_em,
    total: Number(detalhe.order.total),
    status: detalhe.order.status,
    itens: (detalhe.order.itens_pedido ?? []).map((i) => ({
      id: i.id,
      nome_produto: i.nome_produto,
      quantidade: i.quantidade,
      preco_total: Number(i.preco_total),
    })),
  }

  return (
    <OrderPipeline
      order={order}
      history={detalhe.history}
      receitaStatus={detalhe.receitaStatus}
      permissoes={permissoes}
    />
  )
}
