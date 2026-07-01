import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ProdutoForm } from "@/components/admin/produto-form"
import { atualizarProduto } from "@/app/admin/produtos/actions"

export const metadata: Metadata = { title: "Editar produto" }

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: produto }, { data: categorias }] = await Promise.all([
    supabase.from("produtos").select("*").eq("id", id).single(),
    supabase.from("categorias").select("id, titulo").eq("ativo", true).order("ordem"),
  ])

  if (!produto) notFound()

  const action = atualizarProduto.bind(null, id)

  return (
    <div className="mx-auto max-w-3xl">
      <ProdutoForm
        titulo={`Editar: ${produto.nome}`}
        categorias={categorias ?? []}
        inicial={produto as Parameters<typeof ProdutoForm>[0]["inicial"]}
        action={action}
      />
    </div>
  )
}
