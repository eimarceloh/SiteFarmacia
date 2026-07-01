"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { products as staticProducts, formatBRL, type Product } from "@/lib/products"
import { categories as staticCategories } from "@/lib/categories"
import { useCart } from "@/components/cart-provider"
import { useInventory, displayPrice, isAvailable } from "@/components/products-inventory-provider"

const ALL_SLUG = "todos"

export function AllProducts({ dbProducts }: { dbProducts?: Product[] }) {
  const { addItem } = useCart()
  const { getItem } = useInventory()
  const [active, setActive] = useState(ALL_SLUG)

  // Usa produtos do Supabase quando disponíveis; static como fallback
  const allProducts = dbProducts ?? staticProducts

  // Deriva as categorias presentes nos produtos (sem depender de lib/categories quando há dados do DB)
  const catSlugs = [...new Set(allProducts.map((p) => p.categorySlug).filter(Boolean))]
  const cats = catSlugs.map((slug) => {
    const fromStatic = staticCategories.find((c) => c.slug === slug)
    return { slug, title: fromStatic?.title ?? slug }
  })

  const filtered =
    active === ALL_SLUG ? allProducts : allProducts.filter((p) => p.categorySlug === active)

  return (
    <section className="bg-background py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4">

        {/* Filtros */}
        <div className="mb-10 flex flex-wrap gap-2">
          <button
            onClick={() => setActive(ALL_SLUG)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
              active === ALL_SLUG
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
            }`}
          >
            Todos ({allProducts.length})
          </button>
          {cats.map((cat) => {
            const count = allProducts.filter((p) => p.categorySlug === cat.slug).length
            return (
              <button
                key={cat.slug}
                onClick={() => setActive(cat.slug)}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                  active === cat.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {cat.title} ({count})
              </button>
            )
          })}
        </div>

        {/* Contagem */}
        <p className="mb-6 text-sm text-muted-foreground">
          Exibindo <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "produto" : "produtos"}
          {active !== ALL_SLUG && (
            <> em <span className="font-semibold text-primary">
              {cats.find((c) => c.slug === active)?.title}
            </span></>
          )}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => {
            const fromDb = p.estoque !== undefined
            const inv = fromDb ? null : getItem(p.id)
            const price     = fromDb ? p.price    : displayPrice(inv!)
            const oldPrice  = fromDb ? p.oldPrice : (inv!.campaignPrice ? inv!.basePrice : p.oldPrice)
            const available = fromDb
              ? (p.ativo !== false && p.estoque! > 0)
              : isAvailable(inv!)
            const discount  = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

            return (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={`/produtos/${p.id}`} className="relative aspect-square block overflow-hidden bg-secondary">
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {p.tag}
                  </span>
                  {!available && (
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-foreground/80 px-3 py-1 text-xs font-semibold text-background">
                      Esgotado
                    </span>
                  )}
                  {discount > 0 && available && (
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
                      -{discount}%
                    </span>
                  )}
                  <img
                    src={p.image || "/placeholder.svg"}
                    alt={`Embalagem do produto ${p.name}`}
                    className={`size-full object-cover transition-transform duration-300 group-hover:scale-105 ${!available ? "opacity-50" : ""}`}
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
                    {available ? (
                      <>
                        {oldPrice > price && (
                          <p className="text-sm text-muted-foreground line-through">
                            R$ {formatBRL(oldPrice)}
                          </p>
                        )}
                        <p className="text-xl font-extrabold text-foreground">
                          R$ {formatBRL(price)}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-muted-foreground">Fora de estoque</p>
                    )}
                  </div>
                  <Button
                    className="w-full gap-2"
                    onClick={() => available && addItem(p)}
                    disabled={!available}
                    variant={available ? "default" : "outline"}
                  >
                    <ShoppingCart className="size-4" aria-hidden="true" />
                    {available ? "Comprar" : "Indisponível"}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
