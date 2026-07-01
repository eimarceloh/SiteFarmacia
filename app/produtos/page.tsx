import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AllProducts } from "@/components/all-products"
import { createClient } from "@/lib/supabase/server"
import { getProducts, adaptDbProduct } from "@/lib/supabase/queries/products"
import type { Product } from "@/lib/products"

export const metadata = {
  title: "Todos os Produtos | Farmácia do Povo",
  description: "Explore todos os nossos produtos manipulados por categoria.",
}

export default async function ProdutosPage() {
  let dbProducts: Product[] | undefined

  try {
    const supabase = await createClient()
    const rows = await getProducts(supabase)
    dbProducts = rows.map(adaptDbProduct)
  } catch {
    // fallback para produtos estáticos
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-primary py-12 text-primary-foreground md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
            Catálogo completo
          </p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
            Todos os Produtos
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-primary-foreground/80 md:text-lg">
            Fórmulas manipuladas sob medida para cada objetivo. Use os filtros para encontrar o produto ideal.
          </p>
        </div>
      </section>
      <AllProducts dbProducts={dbProducts} />
      <SiteFooter />
    </main>
  )
}
