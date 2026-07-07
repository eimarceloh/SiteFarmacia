import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AdminOrdersTable } from "@/components/admin-orders-table"
import { adaptAdminOrder, type AdminOrder } from "@/lib/admin-data"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getAdminOrders } from "@/lib/supabase/queries/orders"
import { usuarioTemPermissao } from "@/lib/rbac/verificar"
import { formatBRL } from "@/lib/products"

export const metadata: Metadata = { title: "Pedidos" }
export const dynamic = "force-dynamic"

export default async function AdminPedidosPage() {
  const podeVer = await usuarioTemPermissao("pedido.ver_todos")
  if (!podeVer) redirect("/acesso-negado")

  let orders: AdminOrder[] = []
  try {
    const rows = await getAdminOrders(supabaseAdmin)
    orders = rows.map(adaptAdminOrder)
  } catch {
    // Supabase indisponível — lista vazia
  }

  const total = orders.reduce((s, o) => s + o.total, 0)
  const pending = orders.filter((o) => o.status !== "entregue").length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">Pedidos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {orders.length} pedidos · R$ {formatBRL(total)} em receita · {pending} aguardando
          </p>
        </div>
      </div>

      <AdminOrdersTable orders={orders} />
    </div>
  )
}
