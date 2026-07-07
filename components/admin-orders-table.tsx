"use client"

import { useState, useTransition } from "react"
import { STATUS_STYLES_ADMIN } from "@/lib/admin-data"
import type { AdminOrder } from "@/lib/admin-data"
import type { OrderStatus } from "@/lib/orders"
import { formatBRL } from "@/lib/products"
import { atualizarStatusPedido } from "@/app/admin/pedidos/actions"
import { ChevronDown } from "lucide-react"

const ALL_STATUSES: { value: OrderStatus | "todos"; label: string }[] = [
  { value: "todos",       label: "Todos"          },
  { value: "confirmado",  label: "Confirmado"     },
  { value: "manipulacao", label: "Em manipulação" },
  { value: "despachado",  label: "Despachado"     },
  { value: "transito",    label: "Em trânsito"    },
  { value: "entregue",    label: "Entregue"       },
]

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "confirmado",  label: "Confirmado"     },
  { value: "manipulacao", label: "Em manipulação" },
  { value: "despachado",  label: "Despachado"     },
  { value: "transito",    label: "Em trânsito"    },
  { value: "entregue",    label: "Entregue"       },
]

const STATUS_LABELS: Record<OrderStatus, string> = {
  confirmado:  "Confirmado",
  manipulacao: "Em manipulação",
  despachado:  "Despachado",
  transito:    "Em trânsito",
  entregue:    "Entregue",
}

export function AdminOrdersTable({ orders: initialOrders }: { orders: AdminOrder[] }) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders)
  const [filter, setFilter] = useState<OrderStatus | "todos">("todos")
  const [search, setSearch] = useState("")
  const [savingId, setSavingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "todos" || o.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  function updateStatus(order: AdminOrder, status: OrderStatus) {
    const previous = order.status
    // Atualização otimista
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id ? { ...o, status, statusLabel: STATUS_LABELS[status] } : o,
      ),
    )

    if (!order.dbId) return // pedido sem vínculo no banco (fallback)

    setSavingId(order.id)
    startTransition(async () => {
      const res = await atualizarStatusPedido(order.dbId!, status)
      setSavingId(null)
      if (res.error) {
        // Reverte em caso de falha
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, status: previous, statusLabel: STATUS_LABELS[previous] } : o,
          ),
        )
      }
    })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Buscar por pedido ou cliente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full max-w-xs rounded-lg border border-input bg-card px-4 text-sm outline-none ring-ring focus-visible:ring-2"
        />
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {label}
              <span className="ml-1.5 opacity-70">
                ({value === "todos" ? orders.length : orders.filter((o) => o.status === value).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3">Pedido</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Itens</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Pagamento</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/50">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                    <td className="px-6 py-4 text-center text-foreground">{order.items}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      R$ {formatBRL(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        order.payment === "pix"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      }`}>
                        {order.payment === "pix" ? "PIX" : "Cartão"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES_ADMIN[order.status]}`}>
                        {order.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          disabled={savingId === order.id}
                          onChange={(e) => updateStatus(order, e.target.value as OrderStatus)}
                          className="h-8 appearance-none rounded-lg border border-input bg-background pl-3 pr-7 text-xs outline-none ring-ring focus-visible:ring-2 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="border-t border-border px-6 py-3 text-xs text-muted-foreground">
            Exibindo {filtered.length} de {orders.length} pedidos ·{" "}
            Receita filtrada: <span className="font-semibold text-foreground">
              R$ {formatBRL(filtered.reduce((s, o) => s + o.total, 0))}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
