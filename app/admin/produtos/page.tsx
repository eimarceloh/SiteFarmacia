import Link from "next/link"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { AdminProductsTable } from "@/components/admin/admin-products-table"
import { Plus } from "lucide-react"

export const metadata: Metadata = { title: "Produtos" }

export default async function AdminProdutosPage() {
  const supabase = await createClient()

  const { data: produtos } = await supabase
    .from("produtos")
    .select("id, nome, tag, url_imagem, preco_base, preco_campanha, label_campanha, estoque, ativo, categorias(titulo)")
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true })

  const lista = produtos ?? []
  const totalAtivos   = lista.filter((p) => p.ativo).length
  const totalEsgotado = lista.filter((p) => p.estoque === 0).length
  const totalCampanha = lista.filter((p) => p.preco_campanha).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">Produtos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie estoque, preços e campanhas de desconto
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="size-4" />
          Novo produto
        </Link>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total",       value: lista.length,    cls: "text-blue-600"    },
          { label: "Ativos",      value: totalAtivos,     cls: "text-emerald-600" },
          { label: "Esgotados",   value: totalEsgotado,   cls: "text-red-600"     },
          { label: "Em campanha", value: totalCampanha,   cls: "text-violet-600"  },
        ].map(({ label, value, cls }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`mt-1.5 font-heading text-2xl font-extrabold ${cls}`}>{value}</p>
          </div>
        ))}
      </div>

      <AdminProductsTable produtos={lista} />
    </div>
  )
}
