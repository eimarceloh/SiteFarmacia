import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchResults } from "@/components/search-results"
import { createClient } from "@/lib/supabase/server"
import { searchProducts, adaptDbProduct } from "@/lib/supabase/queries/products"
import type { Product } from "@/lib/products"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `"${q}" — Busca | Farmácia do Povo` : "Busca | Farmácia do Povo",
  }
}

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ""

  let dbProducts: Product[] | undefined
  if (query.length >= 2) {
    try {
      const supabase = await createClient()
      const rows = await searchProducts(supabase, query)
      dbProducts = rows.map(adaptDbProduct)
    } catch {
      // fallback para busca estática no cliente
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-primary py-10 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
            Busca
          </p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
            {query ? `Resultados para "${query}"` : "O que você está buscando?"}
          </h1>
        </div>
      </section>

      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <SearchResults query={query} dbProducts={dbProducts} />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
