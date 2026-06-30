"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useInventory, isAvailable } from "@/components/products-inventory-provider"
import type { Product } from "@/lib/products"
import { Minus, Plus, ShoppingCart, PackageX } from "lucide-react"

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const { addItem, updateQuantity, items } = useCart()
  const { getItem } = useInventory()

  const inv = getItem(product.id)
  const available = isAvailable(inv)

  if (!available) {
    return (
      <div className="rounded-xl border border-border bg-secondary p-4 text-center">
        <div className="mb-1 flex items-center justify-center gap-2 text-muted-foreground">
          <PackageX className="size-5" />
          <span className="font-semibold text-foreground">
            {inv.stock === 0 ? "Produto esgotado" : "Produto indisponível"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {inv.stock === 0
            ? "Este item está temporariamente fora de estoque."
            : "Este produto não está disponível no momento."}
        </p>
      </div>
    )
  }

  const maxQty = inv.stock
  const inCart = items.find((i) => i.id === product.id)?.quantity ?? 0
  const canAdd = inCart + quantity <= maxQty

  function handleAdd() {
    const existing = items.find((i) => i.id === product.id)
    const currentQty = existing?.quantity ?? 0
    addItem(product)
    if (quantity > 1) {
      updateQuantity(product.id, currentQty + quantity)
    }
    setQuantity(1)
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-full border border-border">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
          aria-label="Diminuir quantidade"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-10 text-center text-sm font-medium tabular-nums" aria-live="polite">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity((q) => Math.min(q + 1, maxQty - inCart))}
          disabled={!canAdd}
          className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary disabled:opacity-30"
          aria-label="Aumentar quantidade"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <Button size="lg" className="flex-1 gap-2" onClick={handleAdd} disabled={!canAdd}>
        <ShoppingCart className="size-5" aria-hidden="true" />
        Adicionar ao carrinho
      </Button>
    </div>
  )
}
