"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { usuarioTemPermissao } from "@/lib/rbac/verificar"
import { mudarStatusPedido } from "@/lib/supabase/queries/orders"
import {
  proximaEtapa, permissaoParaAvancar, indexEtapa, transicaoValida,
  STAGE_INFO, ROTULOS_STATUS, PIPELINE_STAGES, type PipelineStage,
} from "@/lib/order-pipeline"
import type { OrderStatus } from "@/lib/orders"

export type ActionResult = { error?: string; success?: boolean }

async function usuarioAtual(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

function revalidar(pedidoId: string) {
  revalidatePath(`/admin/pedidos/${pedidoId}`)
  revalidatePath("/admin/pedidos")
  revalidatePath("/admin/manipulacao")
  revalidatePath("/admin/atendimento")
  revalidatePath("/admin")
}

async function statusAtual(pedidoId: string): Promise<string | null> {
  const { data } = await supabaseAdmin.from("pedidos").select("status").eq("id", pedidoId).single()
  return (data as { status: string } | null)?.status ?? null
}

// ── Avançar 1 etapa na esteira (validado + registra executor) ─────────────────
export async function avancarPipeline(pedidoId: string, observacao?: string): Promise<ActionResult> {
  const atual = await statusAtual(pedidoId)
  if (!atual) return { error: "Pedido não encontrado." }

  const proxima = proximaEtapa(atual)
  if (!proxima) return { error: "O pedido já está na etapa final." }

  const perm = permissaoParaAvancar(atual)
  if (!perm || !(await usuarioTemPermissao(perm))) {
    return { error: "Você não tem permissão para avançar esta etapa." }
  }

  // Validação de negócio: receita vinculada precisa estar aprovada antes da manipulação
  if (atual === "confirmado") {
    const { data: receita } = await supabaseAdmin
      .from("receitas").select("status").eq("pedido_id", pedidoId).maybeSingle()
    const rec = receita as { status: string } | null
    if (rec && rec.status !== "aprovado") {
      return { error: "A receita vinculada precisa ser aprovada pelo farmacêutico antes da manipulação." }
    }
  }

  try {
    await mudarStatusPedido(supabaseAdmin, {
      pedidoId,
      novoStatus: proxima,
      rotulo: STAGE_INFO[proxima].label,
      criadoPor: await usuarioAtual(),
      observacao,
    })
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao avançar etapa." }
  }

  revalidar(pedidoId)
  return { success: true }
}

// ── Voltar 1 etapa (correção) ─────────────────────────────────────────────────
export async function reverterEtapa(pedidoId: string, motivo?: string): Promise<ActionResult> {
  if (!(await usuarioTemPermissao("pedido.atualizar_status"))) {
    return { error: "Você não tem permissão para reverter etapas." }
  }
  const atual = await statusAtual(pedidoId)
  if (!atual) return { error: "Pedido não encontrado." }

  const idx = indexEtapa(atual)
  if (idx <= 0) return { error: "Não é possível voltar a partir desta etapa." }
  const anterior = PIPELINE_STAGES[idx - 1] as PipelineStage

  try {
    await mudarStatusPedido(supabaseAdmin, {
      pedidoId,
      novoStatus: anterior,
      rotulo: `Retornado para: ${STAGE_INFO[anterior].label}`,
      criadoPor: await usuarioAtual(),
      observacao: motivo,
    })
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao reverter etapa." }
  }

  revalidar(pedidoId)
  return { success: true }
}

// ── Cancelar pedido ───────────────────────────────────────────────────────────
export async function cancelarPedido(pedidoId: string, motivo: string): Promise<ActionResult> {
  if (!(await usuarioTemPermissao("pedido.cancelar"))) {
    return { error: "Você não tem permissão para cancelar pedidos." }
  }
  if (!motivo?.trim()) return { error: "Informe o motivo do cancelamento." }

  const atual = await statusAtual(pedidoId)
  if (!atual) return { error: "Pedido não encontrado." }
  if (atual === "entregue") return { error: "Um pedido já entregue não pode ser cancelado." }
  if (atual === "cancelado") return { error: "Este pedido já está cancelado." }

  try {
    await mudarStatusPedido(supabaseAdmin, {
      pedidoId,
      novoStatus: "cancelado" as OrderStatus,
      rotulo: ROTULOS_STATUS.cancelado,
      criadoPor: await usuarioAtual(),
      observacao: motivo.trim(),
    })
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao cancelar pedido." }
  }

  revalidar(pedidoId)
  return { success: true }
}

// ── Override direto (dropdown da tabela de pedidos) ───────────────────────────
// Mantém a flexibilidade do admin de setar qualquer status, mas agora valida a
// transição e registra o histórico com o executor.
export async function atualizarStatusPedido(pedidoId: string, status: OrderStatus): Promise<ActionResult> {
  if (!(await usuarioTemPermissao("pedido.atualizar_status"))) {
    return { error: "Você não tem permissão para atualizar o status." }
  }
  const atual = await statusAtual(pedidoId)
  if (!atual) return { error: "Pedido não encontrado." }
  if (atual === status) return { success: true }

  if (!transicaoValida(atual, status)) {
    return { error: `Transição inválida: ${ROTULOS_STATUS[atual] ?? atual} → ${ROTULOS_STATUS[status] ?? status}.` }
  }

  try {
    await mudarStatusPedido(supabaseAdmin, {
      pedidoId,
      novoStatus: status,
      rotulo: ROTULOS_STATUS[status] ?? status,
      criadoPor: await usuarioAtual(),
    })
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao atualizar status." }
  }

  revalidar(pedidoId)
  return { success: true }
}
