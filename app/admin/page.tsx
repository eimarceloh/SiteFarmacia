import type { Metadata } from "next"
import { ADMIN_ORDERS, WEEKLY_REVENUE, TOP_PRODUCTS, STATUS_STYLES_ADMIN } from "@/lib/admin-data"
import { formatBRL } from "@/lib/products"
import { TrendingUp, ShoppingBag, Users, Clock } from "lucide-react"

export const metadata: Metadata = { title: "Dashboard" }

const totalRevenue = ADMIN_ORDERS.reduce((s, o) => s + o.total, 0)
const totalOrders = ADMIN_ORDERS.length
const avgTicket = totalRevenue / totalOrders
const pending = ADMIN_ORDERS.filter((o) => o.status !== "entregue").length

const metrics = [
  { label: "Receita total",    value: `R$ ${formatBRL(totalRevenue)}`, icon: TrendingUp,  color: "text-emerald-600 bg-emerald-50" },
  { label: "Total de pedidos", value: String(totalOrders),              icon: ShoppingBag, color: "text-blue-600 bg-blue-50"      },
  { label: "Ticket médio",     value: `R$ ${formatBRL(avgTicket)}`,     icon: Users,       color: "text-violet-600 bg-violet-50"  },
  { label: "Aguardando",       value: String(pending),                  icon: Clock,       color: "text-amber-600 bg-amber-50"    },
]

const maxRevenue = Math.max(...WEEKLY_REVENUE.map((w) => w.value))
const recentOrders = ADMIN_ORDERS.slice(0, 6)

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">Bem-vindo de volta</p>
        <h1 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">Dashboard</h1>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <span className={`flex size-9 items-center justify-center rounded-full ${color}`}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <p className="font-heading text-2xl font-extrabold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Gráfico de receita */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-1 font-heading text-base font-bold text-foreground">Receita semanal</h2>
          <p className="mb-6 text-xs text-muted-foreground">Últimas 8 semanas</p>

          <div className="flex items-end gap-2" style={{ height: "160px" }}>
            {WEEKLY_REVENUE.map(({ label, value }) => {
              const pct = (value / maxRevenue) * 100
              return (
                <div key={label} className="group relative flex flex-1 flex-col items-center gap-1">
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute bottom-full mb-1 hidden -translate-x-1/2 left-1/2 rounded-lg border border-border bg-card px-2 py-1 text-xs font-semibold text-foreground shadow-md group-hover:block whitespace-nowrap">
                    R$ {formatBRL(value)}
                  </div>
                  <div
                    className="w-full rounded-t-md bg-primary transition-opacity group-hover:opacity-80"
                    style={{ height: `${pct}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Produtos mais vendidos */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-1 font-heading text-base font-bold text-foreground">Top produtos</h2>
          <p className="mb-5 text-xs text-muted-foreground">Por número de vendas</p>

          <ul className="flex flex-col gap-4">
            {TOP_PRODUCTS.map(({ name, sales, revenue }, i) => {
              const pct = (sales / TOP_PRODUCTS[0].sales) * 100
              return (
                <li key={name}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{name}</span>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">{sales} vendas</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Pedidos recentes */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-heading text-base font-bold text-foreground">Pedidos recentes</h2>
          <a href="/admin/pedidos" className="text-sm font-medium text-primary hover:underline">
            Ver todos
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3">Pedido</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary/50">
                  <td className="px-6 py-4 font-mono font-semibold text-foreground">{order.id}</td>
                  <td className="px-6 py-4 text-foreground">{order.customer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">R$ {formatBRL(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES_ADMIN[order.status]}`}>
                      {order.statusLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
