// Motor da esteira de produção do pedido.
// Define as etapas, a ordem, a próxima etapa e qual permissão é necessária
// para avançar A PARTIR de cada etapa. Mantido puro (sem JSX) para ser usado
// tanto em Server Actions quanto em componentes.

import type { PermissaoChave } from "@/lib/rbac/tipos"

export const PIPELINE_STAGES = [
  "confirmado",
  "manipulacao",
  "despachado",
  "transito",
  "entregue",
] as const

export type PipelineStage = (typeof PIPELINE_STAGES)[number]
export type OrderStage = PipelineStage | "cancelado"

type StageInfo = {
  label: string
  descricao: string
  acaoLabel: string             // texto do botão para avançar a partir desta etapa
  proxima: PipelineStage | null // próxima etapa da esteira
  permissaoAvancar: PermissaoChave | null // permissão exigida para avançar a partir daqui
}

export const STAGE_INFO: Record<PipelineStage, StageInfo> = {
  confirmado: {
    label: "Pedido confirmado",
    descricao: "Pedido recebido e pagamento aprovado.",
    acaoLabel: "Enviar para manipulação",
    proxima: "manipulacao",
    permissaoAvancar: "pedido.atualizar_status",
  },
  manipulacao: {
    label: "Em manipulação",
    descricao: "Fórmula sendo preparada no laboratório.",
    acaoLabel: "Marcar como pronto (despachar)",
    proxima: "despachado",
    permissaoAvancar: "manipulacao.atualizar",
  },
  despachado: {
    label: "Despachado",
    descricao: "Pedido embalado e pronto para envio.",
    acaoLabel: "Enviar para transporte",
    proxima: "transito",
    permissaoAvancar: "pedido.atualizar_status",
  },
  transito: {
    label: "Em trânsito",
    descricao: "Pedido a caminho do cliente.",
    acaoLabel: "Confirmar entrega",
    proxima: "entregue",
    permissaoAvancar: "pedido.atualizar_status",
  },
  entregue: {
    label: "Entregue",
    descricao: "Pedido entregue ao cliente.",
    acaoLabel: "",
    proxima: null,
    permissaoAvancar: null,
  },
}

export const CANCELADO_LABEL = "Pedido cancelado"

export const ROTULOS_STATUS: Record<string, string> = {
  ...Object.fromEntries(PIPELINE_STAGES.map((s) => [s, STAGE_INFO[s].label])),
  cancelado: CANCELADO_LABEL,
}

// Índice da etapa na esteira (-1 se cancelado/desconhecido)
export function indexEtapa(status: string): number {
  return (PIPELINE_STAGES as readonly string[]).indexOf(status)
}

export function proximaEtapa(status: string): PipelineStage | null {
  const s = status as PipelineStage
  return STAGE_INFO[s]?.proxima ?? null
}

export function permissaoParaAvancar(status: string): PermissaoChave | null {
  const s = status as PipelineStage
  return STAGE_INFO[s]?.permissaoAvancar ?? null
}

// O usuário (dada sua lista de permissões) pode avançar a partir do status atual?
export function podeAvancar(status: string, permissoes: string[]): boolean {
  const perm = permissaoParaAvancar(status)
  return !!perm && !!proximaEtapa(status) && permissoes.includes(perm)
}

// Valida se a transição de → para é permitida pela esteira.
// Aceita: avançar 1 etapa, voltar 1 etapa (correção) ou cancelar.
export function transicaoValida(de: string, para: string): boolean {
  if (para === "cancelado") return de !== "entregue" && de !== "cancelado"
  const i = indexEtapa(de)
  const j = indexEtapa(para)
  if (i === -1 || j === -1) return false
  return j === i + 1 || j === i - 1
}
