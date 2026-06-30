"use client"

import { useState } from "react"
import { Star, CheckCircle2 } from "lucide-react"
import type { Product } from "@/lib/products"

const TABS = [
  { id: "descricao", label: "Descrição" },
  { id: "composicao", label: "Composição" },
  { id: "uso", label: "Modo de uso" },
] as const

type TabId = (typeof TABS)[number]["id"]

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<TabId>("descricao")

  return (
    <div className="mt-16">
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              active === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-8">
        {active === "descricao" && (
          <ul className="space-y-3">
            {product.benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        )}

        {active === "composicao" && (
          <p className="leading-relaxed text-muted-foreground">{product.ingredients}</p>
        )}

        {active === "uso" && (
          <p className="leading-relaxed text-muted-foreground">{product.howToUse}</p>
        )}
      </div>

      <div className="border-t border-border pt-10">
        <h2 className="mb-6 font-heading text-xl font-bold text-foreground">
          Avaliações dos clientes
        </h2>
        <div className="space-y-4">
          {product.reviews.map((review, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-foreground">{review.author}</span>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <div className="mb-3 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-3.5 ${review.rating >= star ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
