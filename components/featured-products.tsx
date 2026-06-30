"use client"

import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Star, ShoppingCart } from "lucide-react"
import { products, formatBRL } from "@/lib/products"
import { useCart } from "@/components/cart-provider"
import { useInventory, displayPrice, isAvailable } from "@/components/products-inventory-provider"

export function FeaturedProducts() {
  const { addItem } = useCart()
  const { getItem } = useInventory()

  return (
    <section id="produtos" className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Mais vendidos
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Fórmulas em destaque
            </h2>
          </div>
          <Link href="/produtos" className={cn(buttonVariants({ variant: "outline" }))}>
            Ver todos os produtos
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => {
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
                <Link href={`/produtos/${p.id}`} className="relative aspect-square block overflow-hidden bg-secondary">
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
                    <h3 className="font-heading text-base font-bold leading-snug text-foreground hover:text-primary">
                      {p.name}
                    </h3>
                  </Link>
                  <div className="mt-auto">
                    {available ? (
                      <>
                        {oldPrice > price && (
                          <p className="text-sm text-muted-foreground line-through">R$ {formatBRL(oldPrice)}</p>
                        )}
                        <p className="text-xl font-extrabold text-foreground">
                          R$ {formatBRL(price)}
                        </p>
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
      </div>
    </section>
  )
}
