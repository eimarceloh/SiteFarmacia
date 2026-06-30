"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { products as staticProducts } from "@/lib/products"
import type { Product } from "@/lib/products"

export type InventoryItem = {
  id: string
  stock: number
  basePrice: number
  campaignPrice?: number
  isActive: boolean
  // custom product fields (undefined for static products)
  customData?: Omit<Product, "id" | "price" | "oldPrice">
}

type InventoryCtx = {
  items: Record<string, InventoryItem>
  getItem: (id: string) => InventoryItem
  updateItem: (id: string, patch: Partial<Omit<InventoryItem, "id">>) => void
  deductStock: (id: string, quantity: number) => void
  addCustomProduct: (data: { name: string; tag: string; categorySlug: string; stock: number; basePrice: number; oldPrice: number; description?: string }) => void
  getAllProducts: () => (Product & { inventoryItem: InventoryItem })[]
}

const STORAGE_KEY = "fp-inventory-v1"

const DEFAULT_STOCKS: Record<string, number> = {
  "termo-slim": 48, "detox-fit": 32, "capilar-force": 17,
  "hair-grow": 25, "imuni-vita": 63, "omega-ultra": 41,
  "colageno-skin": 28, "beauty-complex": 19, "pre-treino": 55,
  "massa-max": 34, "libido-plus": 22, "vitalidade-max": 38,
}

function defaultItem(p: Product): InventoryItem {
  return { id: p.id, stock: DEFAULT_STOCKS[p.id] ?? 50, basePrice: p.price, isActive: true }
}

const InventoryContext = createContext<InventoryCtx | null>(null)

export function ProductsInventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, InventoryItem>>({})
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setItems(JSON.parse(raw))
      } else {
        const initial: Record<string, InventoryItem> = {}
        staticProducts.forEach((p) => { initial[p.id] = defaultItem(p) })
        setItems(initial)
      }
    } catch {
      const initial: Record<string, InventoryItem> = {}
      staticProducts.forEach((p) => { initial[p.id] = defaultItem(p) })
      setItems(initial)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const getItem = useCallback((id: string): InventoryItem => {
    if (items[id]) return items[id]
    const p = staticProducts.find((p) => p.id === id)
    return p ? defaultItem(p) : { id, stock: 0, basePrice: 0, isActive: false }
  }, [items])

  const updateItem = useCallback((id: string, patch: Partial<Omit<InventoryItem, "id">>) => {
    setItems((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? getItem(id)), ...patch },
    }))
  }, [getItem])

  const deductStock = useCallback((id: string, quantity: number) => {
    setItems((prev) => {
      const cur = prev[id] ?? getItem(id)
      return { ...prev, [id]: { ...cur, stock: Math.max(0, cur.stock - quantity) } }
    })
  }, [getItem])

  const addCustomProduct = useCallback((data: {
    name: string; tag: string; categorySlug: string
    stock: number; basePrice: number; oldPrice: number; description?: string
  }) => {
    const id = `custom-${Date.now()}`
    const customData: Omit<Product, "id" | "price" | "oldPrice"> = {
      name: data.name,
      tag: data.tag,
      categorySlug: data.categorySlug,
      image: "/images/produto-emagrecimento.png",
      rating: "0.0",
      reviewCount: 0,
      description: data.description ?? "",
      benefits: [],
      ingredients: "",
      howToUse: "",
      reviews: [],
    }
    setItems((prev) => ({
      ...prev,
      [id]: { id, stock: data.stock, basePrice: data.basePrice, isActive: true, customData },
    }))
  }, [])

  const getAllProducts = useCallback((): (Product & { inventoryItem: InventoryItem })[] => {
    const result: (Product & { inventoryItem: InventoryItem })[] = staticProducts.map((p) => ({
      ...p,
      price: getItem(p.id).basePrice,
      inventoryItem: getItem(p.id),
    }))

    Object.values(items)
      .filter((item) => item.customData)
      .forEach((item) => {
        result.push({
          id: item.id,
          price: item.basePrice,
          oldPrice: item.basePrice,
          ...item.customData!,
          inventoryItem: item,
        })
      })

    return result
  }, [items, getItem])

  return (
    <InventoryContext.Provider value={{ items, getItem, updateItem, deductStock, addCustomProduct, getAllProducts }}>
      {children}
    </InventoryContext.Provider>
  )
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error("useInventory must be inside ProductsInventoryProvider")
  return ctx
}

export function displayPrice(item: InventoryItem) {
  return item.campaignPrice ?? item.basePrice
}

export function isAvailable(item: InventoryItem) {
  return item.isActive && item.stock > 0
}
