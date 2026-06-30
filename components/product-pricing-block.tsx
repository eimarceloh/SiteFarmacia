"use client"

import { useInventory, displayPrice, isAvailable } from "@/components/products-inventory-provider"
import { formatBRL } from "@/lib/products"

export function ProductPricingBlock({
  productId,
  staticOldPrice,
}: {
  productId: string
  staticOldPrice: number
}) {
  const { getItem } = useInventory()
  const inv = getItem(productId)
  const price = displayPrice(inv)
  const oldPrice = inv.campaignPrice ? inv.basePrice : staticOldPrice
  const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

  return (
    <div>
      {discount > 0 && (
        <div className="mb-1 flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
            -{discount}% OFF
          </span>
          <span className="text-sm text-muted-foreground line-through">
            R$ {formatBRL(oldPrice)}
          </span>
        </div>
      )}
      <p className="font-heading text-4xl font-extrabold text-foreground">
        R$ {formatBRL(price)}
      </p>
      {inv.stock > 0 && inv.stock <= 10 && (
        <p className="mt-1.5 text-xs font-medium text-amber-600">
          Apenas {inv.stock} {inv.stock === 1 ? "unidade" : "unidades"} em estoque
        </p>
      )}
    </div>
  )
}
