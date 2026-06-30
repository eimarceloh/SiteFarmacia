"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useInventory, displayPrice, isAvailable } from "@/components/products-inventory-provider"
import { products, formatBRL } from "@/lib/products"
import { ShoppingCart, Star, SearchX } from "lucide-react"

function filterProducts(query: string) {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q),
  )
}

export function SearchResults({ query }: { query: string }) {
  const { addItem } = useCart()
  const { getItem } = useInventory()
  const results = filterProducts(query)

  if (query.length < 2) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <SearchX className="size-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">Digite pelo menos 2 caracteres para buscar.</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <SearchX className="size-12 text-muted-foreground/40" />
        <h2 className="font-heading text-xl font-bold text-foreground">
          Nenhum resultado para &ldquo;{query}&rdquo;
        </h2>
        <p className="text-sm text-muted-foreground">
          Tente outros termos ou navegue pelas categorias.
        </p>
        <Link href="/produtos" className="mt-2 text-sm font-semibold text-primary hover:underline">
          Ver todos os produtos
        </Link>
      </div>
    )
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{results.length}</span>{" "}
        {results.length === 1 ? "resultado" : "resultados"} para{" "}
        <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((p) => {
          const inv = getItem(p.id)
          const price = displayPrice(inv)
          const oldPrice = inv.campaignPrice ? inv.basePrice : p.oldPrice
          const available = isAvailable(inv)
          const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

          return (
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
                {!available && (
                  <span className="absolute right-3 top-3 z-10 rounded-full bg-foreground/80 px-3 py-1 text-xs font-semibold text-background">
                    {inv.stock === 0 ? "Esgotado" : "Indisponível"}
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
                  <h2 className="font-heading text-base font-bold leading-snug text-foreground hover:text-primary">
                    {p.name}
                  </h2>
                </Link>
                <div className="mt-auto">
                  {available ? (
                    <>
                      {oldPrice > price && (
                        <p className="text-sm text-muted-foreground line-through">
                          R$ {formatBRL(oldPrice)}
                        </p>
                      )}
                      <p className="text-xl font-extrabold text-foreground">R$ {formatBRL(price)}</p>
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-muted-foreground">
                      {inv.stock === 0 ? "Fora de estoque" : "Indisponível"}
                    </p>
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
    </>
  )
}
