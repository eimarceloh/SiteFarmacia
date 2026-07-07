"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { avancarPipeline, cancelarPedido, reverterEtapa } from "@/app/admin/pedidos/actions"
import {
  PIPELINE_STAGES, STAGE_INFO, indexEtapa, proximaEtapa, podeAvancar,
} from "@/lib/order-pipeline"
import { formatBRL } from "@/lib/products"
import {
  CheckCircle2, Circle, Clock, FlaskConical, Package, Truck, MapPin,
  ChevronLeft, XCircle, User2, ArrowRight, Undo2, FileCheck2, X,
} from "lucide-react"

const STAGE_ICON: Record<string, React.ElementType> = {
  confirmado:  CheckCircle2,
  manipulacao: FlaskConical,
  despachado:  Package,
  transito:    Truck,
  entregue:    MapPin,
}

export type PipelineOrder = {
  id: string
  numero_pedido: string
  nome_cliente: string
  email_cliente: string
  criado_em: string
  total: number
  status: string
  itens: { id: string; nome_produto: string; quantidade: number; preco_total: number }[]
}

export type HistoryEntry = {
  id: string
  status: string
  rotulo: string
  observacao: string | null
  criado_em: string
  autor_nome: string | null
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

export function OrderPipeline({
  order,
  history,
  receitaStatus,
  permissoes,
}: {
  order: PipelineOrder
  history: HistoryEntry[]
  receitaStatus: string | null
  permissoes: string[]
}) {
  const cancelado = order.status === "cancelado"
  const atualIdx = indexEtapa(order.status)
  const prox = proximaEtapa(order.status)

  // Para cada etapa, pega o registro de histórico mais recente que a atingiu
  const registroDaEtapa = (stage: string) =>
    [...history].reverse().find((h) => h.status === stage)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <Link href="/admin/pedidos" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> Voltar aos pedidos
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">
              {order.numero_pedido}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.nome_cliente} · {order.email_cliente} · realizado em {fmt(order.criado_em)}
            </p>
          </div>
          {cancelado && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
              <XCircle className="size-4" /> Cancelado
            </span>
          )}
        </div>
      </div>

      {/* Gate de receita */}
      {receitaStatus && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
          receitaStatus === "aprovado"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-amber-200 bg-amber-50 text-amber-700"
        }`}>
          <FileCheck2 className="size-4 shrink-0" />
          {receitaStatus === "aprovado"
            ? "Receita médica aprovada — liberado para manipulação."
            : `Receita médica: ${receitaStatus.replace("_", " ")}. A manipulação só é liberada após aprovação do farmacêutico.`}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Esteira + timeline */}
        <div className="flex flex-col gap-6">
          {/* Stepper */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-6 font-heading text-lg font-bold text-foreground">Esteira de produção</h2>
            <ol className="flex flex-col">
              {PIPELINE_STAGES.map((stage, i) => {
                const Icon = STAGE_ICON[stage] ?? Circle
                const idx = indexEtapa(stage)
                const done = !cancelado && idx < atualIdx
                const active = !cancelado && idx === atualIdx
                const reg = registroDaEtapa(stage)
                const isLast = i === PIPELINE_STAGES.length - 1

                return (
                  <li key={stage} className="relative flex gap-4">
                    {!isLast && (
                      <div className={`absolute left-[17px] top-9 h-full w-0.5 ${done ? "bg-primary" : "bg-border"}`} aria-hidden="true" />
                    )}
                    <div className="relative z-10 shrink-0">
                      <span className={`flex size-9 items-center justify-center rounded-full border-2 ${
                        done ? "border-primary bg-primary text-primary-foreground"
                        : active ? "border-primary bg-background text-primary"
                        : "border-border bg-background text-muted-foreground"
                      }`}>
                        <Icon className="size-4" />
                      </span>
                    </div>
                    <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                      <p className={`font-semibold leading-none ${done || active ? "text-foreground" : "text-muted-foreground"}`}>
                        {STAGE_INFO[stage].label}
                        {active && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            Etapa atual
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{STAGE_INFO[stage].descricao}</p>
                      {reg && (
                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User2 className="size-3.5" />
                          {reg.autor_nome ?? "Sistema"} · {fmt(reg.criado_em)}
                        </p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Timeline completa */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Registro de atividades</h2>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum registro ainda.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {[...history].reverse().map((h) => (
                  <li key={h.id} className="flex gap-3">
                    <span className={`mt-1 size-2 shrink-0 rounded-full ${h.status === "cancelado" ? "bg-red-500" : "bg-primary"}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground">{h.rotulo}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <User2 className="size-3" /> {h.autor_nome ?? "Sistema"}
                        </span>
                        {" · "}{fmt(h.criado_em)}
                      </p>
                      {h.observacao && (
                        <p className="mt-1 rounded-lg bg-secondary px-3 py-1.5 text-sm text-muted-foreground">{h.observacao}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Ações + resumo */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
          <AcoesPipeline order={order} prox={prox} cancelado={cancelado} atualIdx={atualIdx} permissoes={permissoes} />

          {/* Itens */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 font-heading text-base font-bold text-foreground">Itens</h2>
            <ul className="divide-y divide-border">
              {order.itens.map((it) => (
                <li key={it.id} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-foreground"><span className="font-medium">{it.quantidade}x</span> {it.nome_produto}</span>
                  <span className="font-medium text-foreground">R$ {formatBRL(it.preco_total)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-border pt-3">
              <span className="font-heading font-extrabold text-foreground">Total</span>
              <span className="font-heading font-extrabold text-foreground">R$ {formatBRL(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AcoesPipeline({
  order, prox, cancelado, atualIdx, permissoes,
}: {
  order: PipelineOrder
  prox: ReturnType<typeof proximaEtapa>
  cancelado: boolean
  atualIdx: number
  permissoes: string[]
}) {
  const [saving, startSaving] = useTransition()
  const [erro, setErro] = useState<string | null>(null)
  const [obs, setObs] = useState("")
  const [cancelando, setCancelando] = useState(false)

  const podeAvancarAgora = prox && podeAvancar(order.status, permissoes)
  const podeReverter = atualIdx > 0 && permissoes.includes("pedido.atualizar_status") && !cancelado
  const podeCancelar = permissoes.includes("pedido.cancelar") && !cancelado && order.status !== "entregue"

  function run(fn: () => Promise<{ error?: string }>) {
    setErro(null)
    startSaving(async () => {
      const res = await fn()
      if (res.error) setErro(res.error)
      else setObs("")
    })
  }

  if (cancelado) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Este pedido foi cancelado. Nenhuma ação de produção disponível.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 font-heading text-base font-bold text-foreground">Ações</h2>

      {prox ? (
        <>
          {podeAvancarAgora ? (
            <>
              <textarea
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                rows={2}
                placeholder="Observação (opcional)"
                className="mb-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring focus-visible:ring-2"
              />
              <button
                onClick={() => run(() => avancarPipeline(order.id, obs || undefined))}
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {STAGE_INFO[order.status as keyof typeof STAGE_INFO]?.acaoLabel || "Avançar"}
                <ArrowRight className="size-4" />
              </button>
            </>
          ) : (
            <p className="rounded-lg bg-secondary px-3 py-2.5 text-sm text-muted-foreground">
              A próxima etapa (<strong>{STAGE_INFO[prox].label}</strong>) é executada por outro perfil.
            </p>
          )}
        </>
      ) : (
        <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">
          Pedido concluído — entregue ao cliente.
        </p>
      )}

      {(podeReverter || podeCancelar) && (
        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
          {podeReverter && (
            <button
              onClick={() => run(() => reverterEtapa(order.id, obs || undefined))}
              disabled={saving}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary disabled:opacity-50"
            >
              <Undo2 className="size-4" /> Voltar etapa
            </button>
          )}
          {podeCancelar && (
            <button
              onClick={() => setCancelando(true)}
              disabled={saving}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              <XCircle className="size-4" /> Cancelar pedido
            </button>
          )}
        </div>
      )}

      {erro && <p className="mt-3 text-sm text-destructive">{erro}</p>}

      {cancelando && (
        <CancelarModal
          onClose={() => setCancelando(false)}
          onConfirm={(motivo) => run(() => cancelarPedido(order.id, motivo))}
          saving={saving}
        />
      )}
    </div>
  )
}

function CancelarModal({
  onClose, onConfirm, saving,
}: {
  onClose: () => void
  onConfirm: (motivo: string) => void
  saving: boolean
}) {
  const [motivo, setMotivo] = useState("")
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-foreground">Cancelar pedido</h3>
          <button onClick={onClose} aria-label="Fechar" className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={4}
          placeholder="Motivo do cancelamento…"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-ring focus-visible:ring-2"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary">
            Voltar
          </button>
          <button
            onClick={() => { onConfirm(motivo); onClose() }}
            disabled={saving || !motivo.trim()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            Confirmar cancelamento
          </button>
        </div>
      </div>
    </div>
  )
}
