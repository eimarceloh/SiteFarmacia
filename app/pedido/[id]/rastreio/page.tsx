import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { OrderTracking } from "@/components/order-tracking"
import { createClient } from "@/lib/supabase/server"
import { getOrderByNumber, getOrderStatusHistory } from "@/lib/supabase/queries/orders"
import { PIPELINE_STAGES, STAGE_INFO, ROTULOS_STATUS, indexEtapa } from "@/lib/order-pipeline"
import type { Order, OrderStatus } from "@/lib/orders"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return { title: `Rastreio ${id} | Farmácia do Povo` }
}

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}
function fmtDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

export default async function RastreioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?redirect=/pedido/${id}/rastreio`)

  // RLS garante que só o dono do pedido consegue ler
  const pedido = await getOrderByNumber(supabase, id)
  if (!pedido) notFound()

  const historico = (await getOrderStatusHistory(supabase, pedido.id)) as
    Array<{ status: string; criado_em: string }>

  // Data mais recente em que cada etapa foi atingida (histórico vem em ordem crescente)
  const dataPorEtapa = new Map<string, string>()
  for (const h of historico) dataPorEtapa.set(h.status, h.criado_em)

  const cancelado = pedido.status === "cancelado"
  const atualIdx = indexEtapa(pedido.status)

  const timeline = PIPELINE_STAGES.map((stage, i) => {
    // "confirmado" pode não ter registro no histórico (pedido nasce nesse status)
    const dataIso = stage === "confirmado"
      ? dataPorEtapa.get(stage) ?? pedido.criado_em
      : dataPorEtapa.get(stage)
    return {
      status: stage,
      label: STAGE_INFO[stage].label,
      description: STAGE_INFO[stage].descricao,
      date: dataIso ? fmtDataHora(dataIso) : undefined,
      done: !cancelado && i < atualIdx,
      active: !cancelado && i === atualIdx,
    }
  })

  const order: Order = {
    id: pedido.numero_pedido,
    date: fmtData(pedido.criado_em),
    total: Number(pedido.total),
    status: pedido.status as OrderStatus,
    statusLabel: ROTULOS_STATUS[pedido.status] ?? pedido.status,
    items: (pedido.itens_pedido ?? []).map((it) => ({
      name: it.nome_produto,
      quantity: it.quantidade,
      price: Number(it.preco_unitario),
    })),
    trackingCode: pedido.codigo_rastreio ?? undefined,
    estimatedDelivery: pedido.previsao_entrega ? fmtData(pedido.previsao_entrega) : "A definir",
    timeline,
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <OrderTracking order={order} />
      <SiteFooter />
    </main>
  )
}
