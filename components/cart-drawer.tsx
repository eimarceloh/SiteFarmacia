"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import { formatBRL } from "@/lib/products"
import { X, Minus, Plus, Trash2, ShoppingBag, Truck } from "lucide-react"

const FREE_SHIPPING = 199

export function CartDrawer() {
  const { isOpen, closeCart, items, updateQuantity, removeItem, totalItems, totalPrice, clearCart } =
    useCart()

  // Fecha com a tecla Escape e trava o scroll do body
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [isOpen, closeCart])

  const remaining = Math.max(0, FREE_SHIPPING - totalPrice)

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-foreground/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Painel */}
      <aside
        role="dialog"
        aria-label="Carrinho de compras"
        aria-modal="true"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" aria-hidden="true" />
            <h2 className="font-heading text-lg font-bold text-foreground">
              Seu carrinho {totalItems > 0 && <span className="text-muted-foreground">({totalItems})</span>}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Fechar carrinho">
            <X className="size-5" />
          </Button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="size-7 text-muted-foreground" aria-hidden="true" />
            </span>
            <p className="font-heading text-lg font-semibold text-foreground">Seu carrinho está vazio</p>
            <p className="text-sm text-muted-foreground">
              Explore nossas fórmulas manipuladas e adicione seus produtos.
            </p>
            <Button onClick={closeCart} className="mt-2">
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            {/* Barra de frete grátis */}
            <div className="border-b border-border bg-secondary px-5 py-3">
              <div className="mb-2 flex items-center gap-2 text-sm text-foreground">
                <Truck className="size-4 text-primary" aria-hidden="true" />
                {remaining > 0 ? (
                  <span>
                    Faltam <strong>R$ {formatBRL(remaining)}</strong> para o frete grátis
                  </span>
                ) : (
                  <span className="font-medium text-primary">Você ganhou frete grátis!</span>
                )}
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (totalPrice / FREE_SHIPPING) * 100)}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4">
                  <div className="size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold leading-snug text-foreground">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label={`Remover ${item.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-bold text-foreground">R$ {formatBRL(item.price)}</p>
                    <div className="mt-auto flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex size-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-border px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-heading text-xl font-extrabold text-foreground">
                  R$ {formatBRL(totalPrice)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
              >
                Finalizar compra
              </Link>
              <button
                onClick={clearCart}
                className="mt-3 w-full text-center text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
              >
                Esvaziar carrinho
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
