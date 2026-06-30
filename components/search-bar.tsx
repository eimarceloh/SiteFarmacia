"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { products, formatBRL } from "@/lib/products"

function filterProducts(query: string) {
  const q = query.toLowerCase().trim()
  if (q.length < 2) return []
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
    .slice(0, 5)
}

export function SearchBar({
  className,
  placeholder = "O que você está buscando?",
  onNavigate,
}: {
  className?: string
  placeholder?: string
  onNavigate?: () => void
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const results = filterProducts(query)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setOpen(false)
    onNavigate?.()
    router.push(`/busca?q=${encodeURIComponent(q)}`)
  }

  function handleSelect() {
    setQuery("")
    setOpen(false)
    onNavigate?.()
  }

  return (
    <div ref={wrapperRef} className={`relative ${className ?? ""}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3 size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="h-11 w-full rounded-full border border-input bg-card pl-10 pr-9 text-sm outline-none ring-ring focus-visible:ring-2"
          aria-label="Buscar produtos"
          aria-expanded={open && query.length >= 2}
          aria-autocomplete="list"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setOpen(false) }}
            className="absolute right-3 text-muted-foreground hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      {open && query.length >= 2 && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
        >
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Nenhum resultado para &ldquo;{query}&rdquo;
            </p>
          ) : (
            <>
              <ul className="divide-y divide-border">
                {results.map((p) => (
                  <li key={p.id} role="option">
                    <Link
                      href={`/produtos/${p.id}`}
                      onClick={handleSelect}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary"
                    >
                      <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                        <img
                          src={p.image || "/placeholder.svg"}
                          alt={p.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.tag}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-foreground">
                        R$ {formatBRL(p.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border p-2">
                <button
                  type="button"
                  onClick={handleSubmit as any}
                  className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-primary hover:bg-secondary"
                >
                  Ver todos os resultados para &ldquo;{query}&rdquo;
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
