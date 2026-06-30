import type { Metadata } from "next"
import { AdminOrdersTable } from "@/components/admin-orders-table"
import { ADMIN_ORDERS } from "@/lib/admin-data"
import { formatBRL } from "@/lib/products"

export const metadata: Metadata = { title: "Pedidos" }

const total = ADMIN_ORDERS.reduce((s, o) => s + o.total, 0)
const pending = ADMIN_ORDERS.filter((o) => o.status !== "entregue").length

export default function AdminPedidosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">Pedidos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ADMIN_ORDERS.length} pedidos · R$ {formatBRL(total)} em receita · {pending} aguardando
          </p>
        </div>
      </div>

      <AdminOrdersTable />
    </div>
  )
}
