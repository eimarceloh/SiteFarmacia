"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { SearchBar } from "@/components/search-bar"
import { LogoIcon } from "@/components/logo"
import {
  Menu, ShoppingCart, User, X, LogOut, Package, ChevronDown,
} from "lucide-react"

const navItems = [
  { label: "Emagrecimento", slug: "emagrecimento" },
  { label: "Desempenho",    slug: "desempenho" },
  { label: "Saúde",         slug: "saude" },
  { label: "Queda Capilar", slug: "queda-capilar" },
  { label: "Libido",        slug: "libido" },
  { label: "Beleza",        slug: "beleza" },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { openCart, totalItems } = useCart()
  const { user, loading, signOut } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const firstName = user?.user_metadata?.nome_completo?.split(" ")[0]
    ?? user?.email?.split("@")[0]
    ?? "Conta"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur">
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium md:text-sm">
          <span className="text-balance">
            Frete grátis acima de R$ 199 • Manipulação com registro ANVISA
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="Farmácia do Povo, página inicial">
          <LogoIcon className="size-10 shrink-0" />
          <span className="font-heading text-lg font-extrabold leading-tight tracking-tight text-foreground">
            Farmácia do Pov<span className="text-primary">+</span>
          </span>
        </Link>

        <SearchBar className="ml-2 hidden flex-1 md:block" />

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          {/* Área de usuário — desktop */}
          {!loading && (
            <div className="hidden md:block" ref={dropdownRef}>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "gap-2",
                    )}
                  >
                    <User className="size-4" aria-hidden="true" />
                    {firstName}
                    <ChevronDown className="size-3 text-muted-foreground" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-border bg-card p-1 shadow-lg">
                      <Link
                        href="/conta"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                      >
                        <Package className="size-4 text-muted-foreground" />
                        Minha conta
                      </Link>
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut() }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="size-4" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
                >
                  <User className="size-4" aria-hidden="true" />
                  Entrar
                </Link>
              )}
            </div>
          )}

          <Button size="sm" className="relative gap-2" onClick={openCart}>
            <ShoppingCart className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <nav className="hidden border-t border-border md:block" aria-label="Categorias">
        <ul className="mx-auto flex max-w-6xl items-center gap-1 px-4">
          {navItems.map(({ label, slug }) => (
            <li key={slug}>
              <Link
                href={`/categoria/${slug}`}
                className="inline-flex h-11 items-center rounded-md px-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="px-4 py-3">
            <SearchBar placeholder="Buscar..." onNavigate={() => setMobileOpen(false)} />
          </div>
          <ul className="px-2 pb-3">
            {user ? (
              <>
                <li>
                  <Link
                    href="/conta"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-semibold text-primary hover:bg-secondary"
                  >
                    <Package className="size-4" />
                    Minha conta
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => { setMobileOpen(false); signOut() }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" />
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-3 text-sm font-semibold text-primary hover:bg-secondary"
                >
                  <User className="size-4" />
                  Entrar / Cadastrar
                </Link>
              </li>
            )}
            {navItems.map(({ label, slug }) => (
              <li key={slug}>
                <Link
                  href={`/categoria/${slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
