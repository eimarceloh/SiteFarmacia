"use client"

import { useState, useTransition } from "react"
import { revisarReceita } from "@/app/admin/receitas/actions"
import {
  FileText, CheckCircle2, XCircle, Clock, ExternalLink, Stethoscope, X,
} from "lucide-react"

export type ReceitaItem = {
  id: string
  nome_medico: string | null
  crm: string | null
  uf_crm: string | null
  data_receita: string | null
  url_arquivo: string | null
  nome_arquivo: string | null
  observacoes: string | null
  status: string
  motivo_rejeicao: string | null
  criado_em: string
  clientes: { nome_completo: string | null; email: string | null } | null
}

const STATUS_META: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  aguardando_revisao: { label: "Aguardando revisão", cls: "bg-amber-50 text-amber-700 border-amber-200",     icon: Clock       },
  aprovado:           { label: "Aprovada",           cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  rejeitado:          { label: "Rejeitada",          cls: "bg-red-50 text-red-700 border-red-200",             icon: XCircle     },
}

const FILTROS = [
  { value: "aguardando_revisao", label: "Pendentes" },
  { value: "aprovado",           label: "Aprovadas" },
  { value: "rejeitado",          label: "Rejeitadas" },
  { value: "todas",              label: "Todas" },
]

function formatDate(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

export function ReceitasManager({ receitas }: { receitas: ReceitaItem[] }) {
  const [filtro, setFiltro] = useState<string>("aguardando_revisao")
  const [rejeitando, setRejeitando] = useState<ReceitaItem | null>(null)

  const lista = filtro === "todas" ? receitas : receitas.filter((r) => r.status === filtro)
  const pendentes = receitas.filter((r) => r.status === "aguardando_revisao").length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">Receitas médicas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pendentes} {pendentes === 1 ? "receita aguardando" : "receitas aguardando"} sua validação
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map(({ value, label }) => {
          const count = value === "todas" ? receitas.length : receitas.filter((r) => r.status === value).length
          return (
            <button
              key={value}
              onClick={() => setFiltro(value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                filtro === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {label} <span className="ml-1 opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      {lista.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-20 text-center">
          <FileText className="size-12 text-muted-foreground/40" />
          <p className="font-heading font-bold text-foreground">Nenhuma receita nesta categoria</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {lista.map((r) => (
            <ReceitaCard key={r.id} receita={r} onRejeitar={() => setRejeitando(r)} />
          ))}
        </div>
      )}

      {rejeitando && (
        <RejeitarModal receita={rejeitando} onClose={() => setRejeitando(null)} />
      )}
    </div>
  )
}

function ReceitaCard({ receita: r, onRejeitar }: { receita: ReceitaItem; onRejeitar: () => void }) {
  const [saving, startSaving] = useTransition()
  const meta = STATUS_META[r.status] ?? STATUS_META.aguardando_revisao
  const Icon = meta.icon
  const pendente = r.status === "aguardando_revisao"

  function aprovar() {
    startSaving(async () => { await revisarReceita(r.id, "aprovado") })
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Stethoscope className="size-5" />
          </span>
          <div>
            <p className="font-heading font-bold text-foreground">
              {r.clientes?.nome_completo || "Cliente"}
            </p>
            <p className="text-xs text-muted-foreground">{r.clientes?.email}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.cls}`}>
          <Icon className="size-3.5" /> {meta.label}
        </span>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Médico:</dt>
          <dd className="font-medium text-foreground">{r.nome_medico || "—"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">CRM:</dt>
          <dd className="font-medium text-foreground">{r.crm ? `${r.crm}${r.uf_crm ? `/${r.uf_crm}` : ""}` : "—"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Data da receita:</dt>
          <dd className="font-medium text-foreground">{formatDate(r.data_receita)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Enviada em:</dt>
          <dd className="font-medium text-foreground">{formatDate(r.criado_em)}</dd>
        </div>
      </dl>

      {r.observacoes && (
        <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-sm text-muted-foreground">
          {r.observacoes}
        </p>
      )}

      {r.status === "rejeitado" && r.motivo_rejeicao && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <strong>Motivo da rejeição:</strong> {r.motivo_rejeicao}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {r.url_arquivo && (
          <a
            href={r.url_arquivo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            <ExternalLink className="size-4" /> Ver receita {r.nome_arquivo ? `(${r.nome_arquivo})` : ""}
          </a>
        )}
        {pendente && (
          <>
            <button
              onClick={aprovar}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              <CheckCircle2 className="size-4" /> Aprovar
            </button>
            <button
              onClick={onRejeitar}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              <XCircle className="size-4" /> Rejeitar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function RejeitarModal({ receita, onClose }: { receita: ReceitaItem; onClose: () => void }) {
  const [motivo, setMotivo] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()

  function confirmar() {
    setErro(null)
    startSaving(async () => {
      const res = await revisarReceita(receita.id, "rejeitado", motivo)
      if (res.error) { setErro(res.error); return }
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-foreground">Rejeitar receita</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          Explique o motivo para <strong>{receita.clientes?.nome_completo || "o cliente"}</strong>. Ele poderá reenviar uma nova receita.
        </p>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={4}
          placeholder="Ex: receita ilegível, vencida ou sem assinatura do médico…"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-ring focus-visible:ring-2"
        />
        {erro && <p className="mt-2 text-sm text-destructive">{erro}</p>}
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary">
            Cancelar
          </button>
          <button
            onClick={confirmar}
            disabled={saving}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Rejeitando…" : "Confirmar rejeição"}
          </button>
        </div>
      </div>
    </div>
  )
}
