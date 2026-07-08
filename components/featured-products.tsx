"use client"

import { useState } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Star, ShoppingCart, ArrowRight } from "lucide-react"
import { products as staticProducts, formatBRL, type Product } from "@/lib/products"
import { useCart } from "@/components/cart-provider"
import { useInventory, displayPrice, isAvailable } from "@/components/products-inventory-provider"

// Seleciona produtos por aba de forma determinística a partir da lista estática
const TABS = [
  {
    id: "destaque",
    label: "Em Destaque",
    // 4 produtos com maior reviewCount
    pick: (list: Product[]) =>
      [...list].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4),
  },
  {
    id: "mais-vendidos",
    label: "Mais Vendidos",
    // 4 com maior rating + reviewCount combinados (rating × reviewCount)
    pick: (list: Product[]) =>
      [...list]
        .sort((a, b) => parseFloat(b.rating) * b.reviewCount - parseFloat(a.rating) * a.reviewCount)
        .slice(0, 4),
  },
  {
    id: "lancamentos",
    label: "Lançamentos",
    // 4 últimos da lista (ordem de cadastro)
    pick: (list: Product[]) => list.slice(-4).reverse(),
  },
]

function ProductCard({ p, fromDb = false }: { p: Product; fromDb?: boolean }) {
  const { addItem } = useCart()
  const { getItem } = useInventory()

  const inv        = fromDb ? null : getItem(p.id)
  const price      = fromDb ? p.price     : displayPrice(inv!)
  const oldPrice   = fromDb ? p.oldPrice  : (inv!.campaignPrice ? inv!.basePrice : p.oldPrice)
  const available  = fromDb
    ? (p.ativo !== false && (p.estoque ?? 1) > 0)
    : isAvailable(inv!)
  const discount   = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
      <Link
        href={`/produtos/${p.id}`}
        className="relative aspect-square block overflow-hidden bg-secondary"
      >
        {p.tag && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            {p.tag}
          </span>
        )}
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
          className={cn(
            "size-full object-cover transition-transform duration-300 group-hover:scale-105",
            !available && "opacity-50",
          )}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
          <span className="font-semibold text-foreground">{p.rating}</span>
          <span className="text-xs text-muted-foreground">({p.reviewCount})</span>
        </div>

        <Link href={`/produtos/${p.id}`}>
          <h3 className="font-heading text-base font-bold leading-snug text-foreground hover:text-primary">
            {p.name}
          </h3>
        </Link>

        <div className="mt-auto flex flex-col gap-3">
          {available ? (
            <div>
              {oldPrice > price && (
                <p className="text-sm text-muted-foreground line-through">
                  R$ {formatBRL(oldPrice)}
                </p>
              )}
              <p className="text-xl font-extrabold text-foreground">
                R$ {formatBRL(price)}
              </p>
            </div>
          ) : (
            <p className="text-sm font-semibold text-muted-foreground">Fora de estoque</p>
          )}

          <Button
            className="w-full gap-2"
            onClick={() => available && addItem(p)}
            disabled={!available}
            variant={available ? "default" : "outline"}
            size="sm"
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
            {available ? "Adicionar ao carrinho" : "Indisponível"}
          </Button>
        </div>
      </div>
    </article>
  )
}

export function FeaturedProducts({ dbProducts }: { dbProducts?: Product[] }) {
  const [activeTab, setActiveTab] = useState("destaque")

  const sourceList = dbProducts ?? staticProducts
  const tab = TABS.find((t) => t.id === activeTab) ?? TABS[0]
  const lista = tab.pick(sourceList)

  return (
    <section id="produtos" className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Nossos produtos
          </h2>
          <Link
            href="/produtos"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-primary")}
          >
            Ver todos
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Tabs */}
        <div
          className="mb-8 flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted p-1 scrollbar-none sm:w-fit"
          role="tablist"
          aria-label="Grupos de produtos"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "shrink-0 rounded-lg px-5 py-2 text-sm font-semibold transition-all",
                activeTab === t.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          role="tabpanel"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {lista.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              fromDb={dbProducts !== undefined && p.estoque !== undefined}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
