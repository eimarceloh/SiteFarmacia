"use client"

import { useState, useMemo, useTransition, useOptimistic } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search, Percent, Tag, X, ExternalLink,
  ToggleLeft, ToggleRight, PackageX, Minus, Plus, Pencil, Trash2,
} from "lucide-react"
import { formatBRL } from "@/lib/products"
import {
  toggleAtivo, atualizarEstoque, atualizarPreco,
  aplicarCampanha, removerCampanha, excluirProduto,
} from "@/app/admin/produtos/actions"

type Produto = {
  id: string
  nome: string
  tag: string
  url_imagem: string | null
  preco_base: number
  preco_campanha: number | null
  label_campanha: string | null
  estoque: number
  ativo: boolean
  categorias: { titulo: string } | null
}

// ── Modal de Campanha ─────────────────────────────────────────────────────────

function CampaignModal({
  produto,
  onClose,
  onSave,
}: {
  produto: Produto
  onClose: () => void
  onSave: (preco: number, label: string) => void
}) {
  const [type,  setType]  = useState<"percent" | "fixed">("percent")
  const [value, setValue] = useState("")
  const [label, setLabel] = useState(produto.label_campanha ?? "")

  const previewPrice = useMemo(() => {
    const n = parseFloat(value)
    if (isNaN(n) || n <= 0) return null
    if (type === "percent") return n >= 100 ? null : produto.preco_base * (1 - n / 100)
    return n > 0 && n < produto.preco_base ? n : null
  }, [value, type, produto.preco_base])

  const desconto = previewPrice !== null
    ? Math.round(((produto.preco_base - previewPrice) / produto.preco_base) * 100)
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-foreground">Configurar campanha</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-secondary"><X className="size-5 text-muted-foreground" /></button>
        </div>

        <p className="mb-1 text-sm font-medium text-foreground">{produto.nome}</p>
        <p className="mb-5 text-xs text-muted-foreground">
          Preço base: <strong>R$ {formatBRL(produto.preco_base)}</strong>
          {produto.preco_campanha && <> · Atual: <strong className="text-violet-700">R$ {formatBRL(produto.preco_campanha)}</strong></>}
        </p>

        <div className="mb-4 flex gap-2">
          {(["percent", "fixed"] as const).map((t) => (
            <button key={t} onClick={() => { setType(t); setValue("") }}
              className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${type === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary"}`}>
              {t === "percent" ? "% Desconto" : "Preço fixo (R$)"}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {type === "percent" ? "Percentual de desconto" : "Novo preço (R$)"}
          </label>
          <input type="number" min="0.01" step="0.01"
            max={type === "percent" ? "99" : String(produto.preco_base - 0.01)}
            value={value} onChange={(e) => setValue(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
            autoFocus />
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Rótulo (ex: "Black Friday")</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)}
            placeholder="Opcional"
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2" />
        </div>

        {previewPrice !== null && desconto !== null && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-800">
              De <span className="line-through">R$ {formatBRL(produto.preco_base)}</span>{" "}
              por <strong>R$ {formatBRL(previewPrice)}</strong>{" "}
              <span className="inline-flex items-center rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">-{desconto}% OFF</span>
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {produto.preco_campanha && (
            <button onClick={() => onSave(0, "")}
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/20">
              Remover
            </button>
          )}
          <button onClick={onClose}
            className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary">
            Cancelar
          </button>
          <button onClick={() => previewPrice !== null && onSave(previewPrice, label)}
            disabled={previewPrice === null}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40">
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Tabela principal ──────────────────────────────────────────────────────────

export function AdminProductsTable({ produtos: inicial }: { produtos: Produto[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [search,      setSearch]      = useState("")
  const [campaignId,  setCampaignId]  = useState<string | null>(null)
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({})
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({})

  const [optimistic, addOptimistic] = useOptimistic(
    inicial,
    (state, patch: Partial<Produto> & { id: string }) =>
      state.map((p) => (p.id === patch.id ? { ...p, ...patch } : p)),
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return optimistic
    return optimistic.filter((p) =>
      p.nome.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q) ||
      (p.categorias?.titulo ?? "").toLowerCase().includes(q),
    )
  }, [optimistic, search])

  function refresh() { router.refresh() }

  function act<T>(optimisticPatch: Partial<Produto> & { id: string }, fn: () => Promise<T>) {
    startTransition(async () => {
      addOptimistic(optimisticPatch)
      await fn()
      refresh()
    })
  }

  function getStockInput(p: Produto) { return stockInputs[p.id] ?? String(p.estoque) }
  function getPriceInput(p: Produto) { return priceInputs[p.id] ?? String(p.preco_base) }

  function commitStock(p: Produto) {
    const v = parseInt(stockInputs[p.id] ?? "")
    if (!isNaN(v) && v >= 0 && v !== p.estoque) {
      act({ id: p.id, estoque: v }, () => atualizarEstoque(p.id, v))
    }
    setStockInputs((s) => { const n = { ...s }; delete n[p.id]; return n })
  }

  function adjustStock(p: Produto, delta: number) {
    const cur = parseInt(getStockInput(p)) || 0
    const next = Math.max(0, cur + delta)
    setStockInputs((s) => ({ ...s, [p.id]: String(next) }))
    act({ id: p.id, estoque: next }, () => atualizarEstoque(p.id, next))
  }

  function commitPrice(p: Produto) {
    const v = parseFloat(priceInputs[p.id] ?? "")
    if (!isNaN(v) && v > 0 && v !== p.preco_base) {
      act({ id: p.id, preco_base: v }, () => atualizarPreco(p.id, v))
    }
    setPriceInputs((s) => { const n = { ...s }; delete n[p.id]; return n })
  }

  const campaignProduct = campaignId ? optimistic.find((p) => p.id === campaignId) : null

  return (
    <>
      {/* Barra de busca */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm outline-none ring-ring focus-visible:ring-2"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Produto</th>
                <th className="px-5 py-3">Estoque</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Preço base (R$)</th>
                <th className="px-5 py-3">Campanha</th>
                <th className="px-5 py-3">Preço final</th>
                <th className="px-5 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-muted-foreground">
                    {search ? "Nenhum produto encontrado para essa busca." : "Nenhum produto cadastrado ainda."}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const precoFinal = p.preco_campanha ?? p.preco_base
                  const lowStock   = p.estoque > 0 && p.estoque <= 5

                  return (
                    <tr key={p.id} className={`hover:bg-secondary/50 ${!p.ativo ? "opacity-60" : ""}`}>
                      {/* Produto */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                            {p.url_imagem
                              ? <img src={p.url_imagem} alt={p.nome} className="size-full object-cover" />
                              : <div className="size-full" />}
                          </div>
                          <div>
                            <p className="font-medium leading-snug text-foreground">{p.nome}</p>
                            <p className="text-xs text-muted-foreground">{p.tag}</p>
                          </div>
                        </div>
                      </td>

                      {/* Estoque */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => adjustStock(p, -1)}
                            className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <Minus className="size-3" />
                          </button>
                          <input
                            type="number" min="0"
                            value={getStockInput(p)}
                            onChange={(e) => setStockInputs((s) => ({ ...s, [p.id]: e.target.value }))}
                            onBlur={() => commitStock(p)}
                            onKeyDown={(e) => e.key === "Enter" && commitStock(p)}
                            className="h-8 w-16 rounded-lg border border-input bg-background px-2 text-center text-sm outline-none ring-ring focus-visible:ring-2"
                          />
                          <button
                            onClick={() => adjustStock(p, 1)}
                            className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        {p.estoque === 0 && (
                          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                            <PackageX className="size-3" /> Esgotado
                          </p>
                        )}
                        {lowStock && (
                          <p className="mt-1 text-xs font-medium text-amber-600">Estoque baixo</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => act({ id: p.id, ativo: !p.ativo }, () => toggleAtivo(p.id, !p.ativo))}
                          className="flex items-center gap-1.5 text-sm font-semibold"
                        >
                          {p.ativo
                            ? <><ToggleRight className="size-5 text-emerald-600" /><span className="text-emerald-700">Ativo</span></>
                            : <><ToggleLeft  className="size-5 text-muted-foreground" /><span className="text-muted-foreground">Inativo</span></>}
                        </button>
                      </td>

                      {/* Preço base */}
                      <td className="px-5 py-4">
                        <input
                          type="number" min="0.01" step="0.01"
                          value={getPriceInput(p)}
                          onChange={(e) => setPriceInputs((s) => ({ ...s, [p.id]: e.target.value }))}
                          onBlur={() => commitPrice(p)}
                          onKeyDown={(e) => e.key === "Enter" && commitPrice(p)}
                          className="h-8 w-24 rounded-lg border border-input bg-background px-2 text-sm outline-none ring-ring focus-visible:ring-2"
                        />
                      </td>

                      {/* Campanha */}
                      <td className="px-5 py-4">
                        {p.preco_campanha ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                            <Tag className="size-3" />
                            -{Math.round(((p.preco_base - p.preco_campanha) / p.preco_base) * 100)}% OFF
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Preço final */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">R$ {formatBRL(precoFinal)}</p>
                        {p.preco_campanha && (
                          <p className="text-xs text-muted-foreground line-through">R$ {formatBRL(p.preco_base)}</p>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCampaignId(p.id)}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-violet-400 hover:text-violet-700"
                          >
                            <Percent className="inline size-3 mr-1" />Campanha
                          </button>
                          <Link
                            href={`/admin/produtos/${p.id}/editar`}
                            className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
                            title="Editar"
                          >
                            <Pencil className="size-3.5" />
                          </Link>
                          <Link
                            href={`/produtos/${p.id}`}
                            target="_blank"
                            className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
                            title="Ver no site"
                          >
                            <ExternalLink className="size-3.5" />
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm(`Excluir "${p.nome}"?`)) {
                                act({ id: p.id, ativo: false }, () => excluirProduto(p.id))
                              }
                            }}
                            className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                            title="Excluir"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
          {search && ` (filtrado de ${inicial.length})`}
        </div>
      </div>

      {/* Modal de campanha */}
      {campaignId && campaignProduct && (
        <CampaignModal
          produto={campaignProduct}
          onClose={() => setCampaignId(null)}
          onSave={(preco, label) => {
            if (preco === 0) {
              act({ id: campaignId, preco_campanha: null, label_campanha: null },
                () => removerCampanha(campaignId))
            } else {
              act({ id: campaignId, preco_campanha: preco, label_campanha: label || null },
                () => aplicarCampanha(campaignId, preco, label))
            }
            setCampaignId(null)
          }}
        />
      )}
    </>
  )
}
