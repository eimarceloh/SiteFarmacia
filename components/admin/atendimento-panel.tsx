"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { atualizarStatusPedido } from "@/app/admin/pedidos/actions"
import { formatBRL } from "@/lib/products"
import {
  Headphones, FlaskConical, Truck, PackageCheck, ArrowRight, Inbox,
} from "lucide-react"

export type AtendimentoOrder = {
  id: string
  numero_pedido: string
  nome_cliente: string
  email_cliente: string
  criado_em: string
  total: number
  itens: number
}

export type AtendimentoCounts = {
  confirmado: number
  manipulacao: number
  despachado: number
  transito: number
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

export function AtendimentoPanel({
  novos,
  counts,
}: {
  novos: AtendimentoOrder[]
  counts: AtendimentoCounts
}) {
  const cards = [
    { label: "Novos pedidos", value: counts.confirmado,  icon: Inbox,        cls: "text-blue-600 bg-blue-50"      },
    { label: "Em manipulação", value: counts.manipulacao, icon: FlaskConical, cls: "text-amber-600 bg-amber-50"    },
    { label: "Despachados",    value: counts.despachado,  icon: PackageCheck, cls: "text-orange-600 bg-orange-50"  },
    { label: "Em trânsito",    value: counts.transito,    icon: Truck,        cls: "text-violet-600 bg-violet-50"  },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">Atendimento</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pedidos que precisam da sua ação</p>
        </div>
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          <Headphones className="size-4" /> Ver todos os pedidos
        </Link>
      </div>

      {/* Contadores por status */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <span className={`flex size-9 items-center justify-center rounded-full ${cls}`}>
                <Icon className="size-4" />
              </span>
            </div>
            <p className="font-heading text-2xl font-extrabold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Fila de novos pedidos */}
      <div>
        <h2 className="mb-3 font-heading text-lg font-bold text-foreground">
          Novos pedidos a encaminhar
        </h2>
        {novos.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
            <Inbox className="size-12 text-muted-foreground/40" />
            <p className="font-heading font-bold text-foreground">Tudo em dia!</p>
            <p className="text-sm text-muted-foreground">Nenhum pedido novo aguardando encaminhamento.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {novos.map((o) => (
              <NovoPedidoRow key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NovoPedidoRow({ order }: { order: AtendimentoOrder }) {
  const [saving, startSaving] = useTransition()
  const [erro, setErro] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  function encaminhar() {
    setErro(null)
    startSaving(async () => {
      const res = await atualizarStatusPedido(order.id, "manipulacao")
      if (res.error) { setErro(res.error); return }
      setDone(true)
    })
  }

  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-4 transition-opacity ${done ? "border-emerald-200 opacity-60" : "border-border"}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-foreground">{order.numero_pedido}</span>
          <span className="text-xs text-muted-foreground">· {formatDate(order.criado_em)}</span>
        </div>
        <p className="truncate text-sm text-foreground">{order.nome_cliente}</p>
        <p className="truncate text-xs text-muted-foreground">{order.email_cliente}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">R$ {formatBRL(order.total)}</p>
          <p className="text-xs text-muted-foreground">{order.itens} {order.itens === 1 ? "item" : "itens"}</p>
        </div>
        {done ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
            <FlaskConical className="size-4" /> Enviado
          </span>
        ) : (
          <button
            onClick={encaminhar}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Enviando…" : "Enviar p/ manipulação"}
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>
      {erro && <p className="w-full text-sm text-destructive">{erro}</p>}
    </div>
  )
}
