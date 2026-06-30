import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Shield, Truck, Package, Star } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductActions } from "@/components/product-actions"
import { ProductPricingBlock } from "@/components/product-pricing-block"
import { ProductTabs } from "@/components/product-tabs"
import { products, getProductById, formatBRL } from "@/lib/products"
import { getCategoryBySlug } from "@/lib/categories"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) return {}
  return {
    title: `${product.name} | Farmácia do Povo`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) notFound()

  const category = getCategoryBySlug(product.categorySlug)
  const related = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Navegação">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <ChevronRight className="size-4" aria-hidden="true" />
          {category && (
            <>
              <Link href={`/categoria/${category.slug}`} className="hover:text-foreground">
                {category.title}
              </Link>
              <ChevronRight className="size-4" aria-hidden="true" />
            </>
          )}
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-secondary">
            <img
              src={product.image || "/placeholder.svg"}
              alt={`Embalagem do produto ${product.name}`}
              className="size-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
              {product.tag}
            </span>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-4 ${parseFloat(product.rating) >= star ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviewCount} avaliações)</span>
            </div>

            <ProductPricingBlock
              productId={product.id}
              staticOldPrice={product.oldPrice}
            />

            <p className="text-muted-foreground">{product.description}</p>

            <ProductActions product={product} />

            <div className="grid grid-cols-3 gap-3 border-t border-border pt-5">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Shield className="size-6 text-primary" aria-hidden="true" />
                <span className="text-xs font-medium text-foreground">Registro ANVISA</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Truck className="size-6 text-primary" aria-hidden="true" />
                <span className="text-xs font-medium text-foreground">Frete grátis acima R$199</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Package className="size-6 text-primary" aria-hidden="true" />
                <span className="text-xs font-medium text-foreground">Entrega 3-5 dias úteis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs + Reviews */}
        <ProductTabs product={product} />

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16" aria-label="Produtos relacionados">
            <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Produtos relacionados</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    href={`/produtos/${p.id}`}
                    className="relative aspect-square block overflow-hidden bg-secondary"
                  >
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      {p.tag}
                    </span>
                    <img
                      src={p.image || "/placeholder.svg"}
                      alt={`Embalagem do produto ${p.name}`}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
                      <span className="font-medium text-foreground">{p.rating}</span>
                    </div>
                    <Link href={`/produtos/${p.id}`}>
                      <h3 className="font-heading text-base font-bold leading-snug text-foreground hover:text-primary">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="mt-auto">
                      <p className="text-sm text-muted-foreground line-through">R$ {formatBRL(p.oldPrice)}</p>
                      <p className="text-xl font-extrabold text-foreground">R$ {formatBRL(p.price)}</p>
                    </div>
                    <Link
                      href={`/produtos/${p.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                    >
                      Ver produto
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
