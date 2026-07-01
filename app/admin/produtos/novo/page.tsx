import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ProdutoForm } from "@/components/admin/produto-form"
import { criarProduto } from "@/app/admin/produtos/actions"

export const metadata: Metadata = { title: "Novo produto" }

export default async function NovoProdutoPage() {
  const supabase = await createClient()
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, titulo")
    .eq("ativo", true)
    .order("ordem")

  return (
    <div className="mx-auto max-w-3xl">
      <ProdutoForm
        titulo="Novo produto"
        categorias={categorias ?? []}
        action={criarProduto}
      />
    </div>
  )
}
