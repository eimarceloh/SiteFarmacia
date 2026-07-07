import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getAdminOrders } from "@/lib/supabase/queries/orders"
import { usuarioTemPermissao } from "@/lib/rbac/verificar"
import {
  AtendimentoPanel, type AtendimentoOrder, type AtendimentoCounts,
} from "@/components/admin/atendimento-panel"

export const metadata: Metadata = { title: "Atendimento" }
export const dynamic = "force-dynamic"

export default async function AtendimentoPage() {
  const pode = await usuarioTemPermissao("pedido.ver_todos")
  if (!pode) redirect("/acesso-negado")

  let novos: AtendimentoOrder[] = []
  const counts: AtendimentoCounts = { confirmado: 0, manipulacao: 0, despachado: 0, transito: 0 }

  try {
    const rows = await getAdminOrders(supabaseAdmin)
    for (const o of rows) {
      if (o.status in counts) counts[o.status as keyof AtendimentoCounts]++
    }
    novos = rows
      .filter((o) => o.status === "confirmado")
      .map((o) => ({
        id: o.id,
        numero_pedido: o.numero_pedido,
        nome_cliente: o.nome_cliente,
        email_cliente: o.email_cliente,
        criado_em: o.criado_em,
        total: Number(o.total),
        itens: (o.itens_pedido ?? []).reduce((s, i) => s + i.quantidade, 0),
      }))
  } catch {
    // Supabase indisponível — painel vazio
  }

  return <AtendimentoPanel novos={novos} counts={counts} />
}
