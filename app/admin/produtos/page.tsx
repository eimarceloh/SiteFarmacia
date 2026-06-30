import type { Metadata } from "next"
import { AdminProductsManager } from "@/components/admin-products-manager"

export const metadata: Metadata = { title: "Produtos" }

export default function AdminProdutosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">Produtos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie estoque, preços e campanhas de desconto
        </p>
      </div>

      <AdminProductsManager />
    </div>
  )
}
