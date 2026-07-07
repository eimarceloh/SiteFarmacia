"use client"

import { useState, useTransition } from "react"
import { avancarManipulacao } from "@/app/admin/manipulacao/actions"
import { formatBRL } from "@/lib/products"
import { FlaskConical, PackageCheck, Clock } from "lucide-react"

export type ManipulacaoOrder = {
  id: string
  numero_pedido: string
  nome_cliente: string
  criado_em: string
  total: number
  itens_pedido: { id: string; nome_produto: string; quantidade: number }[]
}

function tempoDecorrido(iso: string) {
  const horas = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000)
  if (horas < 1) return "há menos de 1h"
  if (horas < 24) return `há ${horas}h`
  const dias = Math.floor(horas / 24)
  return `há ${dias}d`
}

export function ManipulacaoBoard({
  orders,
  podeAtualizar = true,
}: {
  orders: ManipulacaoOrder[]
  podeAtualizar?: boolean
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">Manipulação</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "fórmula na fila" : "fórmulas na fila"} do laboratório
          {!podeAtualizar && " · somente leitura"}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-20 text-center">
          <FlaskConical className="size-12 text-muted-foreground/40" />
          <p className="font-heading font-bold text-foreground">Nenhum pedido em manipulação</p>
          <p className="text-sm text-muted-foreground">Novos pedidos confirmados aparecerão aqui para preparo.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((o) => (
            <ManipulacaoCard key={o.id} order={o} podeAtualizar={podeAtualizar} />
          ))}
        </div>
      )}
    </div>
  )
}

function ManipulacaoCard({ order, podeAtualizar }: { order: ManipulacaoOrder; podeAtualizar: boolean }) {
  const [saving, startSaving] = useTransition()
  const [erro, setErro] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function despachar() {
    setErro(null)
    startSaving(async () => {
      const res = await avancarManipulacao(order.id, "despachado")
      if (res.error) { setErro(res.error); return }
      setDone(true)
    })
  }

  return (
    <div className={`flex flex-col rounded-2xl border bg-card p-5 transition-opacity ${done ? "border-emerald-200 opacity-60" : "border-border"}`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold text-foreground">{order.numero_pedido}</span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" /> {tempoDecorrido(order.criado_em)}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{order.nome_cliente}</p>

      <ul className="mt-4 flex flex-1 flex-col gap-2 border-t border-border pt-4">
        {order.itens_pedido.map((item) => (
          <li key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-foreground">{item.nome_produto}</span>
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
              {item.quantidade}x
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-semibold text-foreground">R$ {formatBRL(order.total)}</span>
        {done ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
            <PackageCheck className="size-4" /> Despachado
          </span>
        ) : podeAtualizar ? (
          <button
            onClick={despachar}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <PackageCheck className="size-4" />
            {saving ? "Salvando…" : "Marcar como pronto"}
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
            <Clock className="size-3.5" /> Em preparo
          </span>
        )}
      </div>
      {erro && <p className="mt-2 text-sm text-destructive">{erro}</p>}
    </div>
  )
}
