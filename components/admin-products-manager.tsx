"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Search, Plus, Percent, Tag, X, ExternalLink,
  ToggleLeft, ToggleRight, PackageX, Minus,
} from "lucide-react"
import { useInventory, displayPrice, isAvailable } from "@/components/products-inventory-provider"
import type { InventoryItem } from "@/components/products-inventory-provider"
import { formatBRL } from "@/lib/products"
import { categories } from "@/lib/categories"

// ─── Campaign Modal ──────────────────────────────────────────────────────────

function CampaignModal({
  productName,
  basePrice,
  currentCampaignPrice,
  onApply,
  onRemove,
  onClose,
}: {
  productName: string
  basePrice: number
  currentCampaignPrice?: number
  onApply: (price: number) => void
  onRemove: () => void
  onClose: () => void
}) {
  const [type, setType] = useState<"percent" | "fixed">("percent")
  const [value, setValue] = useState("")

  const previewPrice = useMemo(() => {
    const num = parseFloat(value)
    if (isNaN(num) || num <= 0) return null
    if (type === "percent") {
      if (num >= 100) return null
      const result = basePrice * (1 - num / 100)
      return result > 0 ? result : null
    }
    return num > 0 && num < basePrice ? num : null
  }, [value, type, basePrice])

  const discount = previewPrice !== null
    ? Math.round(((basePrice - previewPrice) / basePrice) * 100)
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-foreground">Configurar campanha</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-secondary">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        <p className="mb-1 text-sm font-medium text-foreground">{productName}</p>
        <p className="mb-5 text-xs text-muted-foreground">
          Preço base: <span className="font-semibold">R$ {formatBRL(basePrice)}</span>
          {currentCampaignPrice && (
            <> · Campanha atual: <span className="font-semibold text-violet-700">R$ {formatBRL(currentCampaignPrice)}</span></>
          )}
        </p>

        <div className="mb-4 flex gap-2">
          {(["percent", "fixed"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setType(t); setValue("") }}
              className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                type === t
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              {t === "percent" ? "% Desconto" : "Preço fixo (R$)"}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {type === "percent" ? "Percentual de desconto" : "Novo preço"}
          </label>
          <input
            type="number"
            min="0.01"
            max={type === "percent" ? "99" : String(basePrice - 0.01)}
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={type === "percent" ? "Ex: 20" : `Ex: ${(basePrice * 0.8).toFixed(2)}`}
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
            autoFocus
          />
        </div>

        {previewPrice !== null && discount !== null && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Prévia para o cliente
            </p>
            <p className="text-sm text-emerald-800">
              De{" "}
              <span className="line-through">R$ {formatBRL(basePrice)}</span>
              {" "}por{" "}
              <span className="font-bold">R$ {formatBRL(previewPrice)}</span>
              {" "}
              <span className="inline-flex items-center rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                -{discount}% OFF
              </span>
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {currentCampaignPrice && (
            <button
              onClick={onRemove}
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/20"
            >
              Remover
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={() => previewPrice !== null && onApply(previewPrice)}
            disabled={previewPrice === null}
            className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── New Product Modal ───────────────────────────────────────────────────────

function NewProductModal({
  onAdd,
  onClose,
}: {
  onAdd: (data: {
    name: string; tag: string; categorySlug: string
    stock: number; basePrice: number; oldPrice: number; description?: string
  }) => void
  onClose: () => void
}) {
  const [name, setName] = useState("")
  const [tag, setTag] = useState("")
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug ?? "saude")
  const [stock, setStock] = useState("50")
  const [basePrice, setBasePrice] = useState("")
  const [oldPrice, setOldPrice] = useState("")
  const [description, setDescription] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !tag || !basePrice) return
    onAdd({
      name, tag, categorySlug,
      stock: parseInt(stock) || 0,
      basePrice: parseFloat(basePrice),
      oldPrice: parseFloat(oldPrice) || parseFloat(basePrice),
      description,
    })
    onClose()
  }

  const inputCls =
    "h-10 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-foreground">Novo produto</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-secondary">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Nome do produto *</label>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                required className={inputCls} placeholder="Ex: Colágeno Premium"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Tag / Rótulo *</label>
              <input
                value={tag} onChange={(e) => setTag(e.target.value)}
                required className={inputCls} placeholder="Ex: Saúde"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Categoria</label>
              <select
                value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Preço de venda (R$) *</label>
              <input
                type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)}
                required min="0.01" step="0.01" className={inputCls} placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Preço original (R$)
                <span className="ml-1 text-xs text-muted-foreground">para exibir riscado</span>
              </label>
              <input
                type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)}
                min="0.01" step="0.01" className={inputCls} placeholder="Deixe vazio se igual"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Estoque inicial</label>
              <input
                type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                min="0" className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Descrição breve</label>
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none ring-ring focus-visible:ring-2"
                placeholder="Descreva o produto brevemente..."
              />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Cadastrar produto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function AdminProductsManager() {
  const { items, getItem, updateItem, addCustomProduct, getAllProducts } = useInventory()
  const allProducts = getAllProducts()

  const [search, setSearch] = useState("")
  const [campaignModal, setCampaignModal] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkPercent, setBulkPercent] = useState("")

  // Local state for inline editing before commit
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({})
  const [priceInputs, setPriceInputs] = useState<Record<string, string>>({})

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return allProducts
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.categorySlug.toLowerCase().includes(q),
    )
  }, [allProducts, search])

  const totalActive = allProducts.filter((p) => getItem(p.id).isActive).length
  const totalOutOfStock = allProducts.filter((p) => getItem(p.id).stock === 0).length
  const totalCampaign = allProducts.filter((p) => !!getItem(p.id).campaignPrice).length

  // Stock helpers
  function getStockInput(id: string) {
    return stockInputs[id] ?? String(getItem(id).stock)
  }

  function commitStock(id: string) {
    const v = parseInt(stockInputs[id] ?? "")
    if (!isNaN(v) && v >= 0) updateItem(id, { stock: v })
    setStockInputs((prev) => { const n = { ...prev }; delete n[id]; return n })
  }

  function adjustStock(id: string, delta: number) {
    const cur = parseInt(getStockInput(id)) || 0
    const next = Math.max(0, cur + delta)
    setStockInputs((prev) => ({ ...prev, [id]: String(next) }))
    updateItem(id, { stock: next })
  }

  // Price helpers
  function getPriceInput(id: string) {
    return priceInputs[id] ?? String(getItem(id).basePrice)
  }

  function commitPrice(id: string) {
    const v = parseFloat(priceInputs[id] ?? "")
    if (!isNaN(v) && v > 0) updateItem(id, { basePrice: v })
    setPriceInputs((prev) => { const n = { ...prev }; delete n[id]; return n })
  }

  // Campaign helpers
  function applyCampaign(id: string, price: number) {
    updateItem(id, { campaignPrice: price })
    setCampaignModal(null)
  }

  function removeCampaign(id: string) {
    updateItem(id, { campaignPrice: undefined })
    setCampaignModal(null)
  }

  // Bulk discount
  function applyBulkDiscount() {
    const pct = parseFloat(bulkPercent)
    if (isNaN(pct) || pct <= 0 || pct >= 100) return
    allProducts.forEach((p) => {
      const inv = getItem(p.id)
      if (inv.isActive) {
        updateItem(p.id, { campaignPrice: inv.basePrice * (1 - pct / 100) })
      }
    })
    setShowBulkModal(false)
    setBulkPercent("")
  }

  // Find product for campaign modal
  const campaignProduct = campaignModal ? allProducts.find((p) => p.id === campaignModal) : null
  const campaignInv = campaignProduct ? getItem(campaignProduct.id) : null

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total de produtos", value: allProducts.length, cls: "text-blue-600" },
          { label: "Ativos",            value: totalActive,         cls: "text-emerald-600" },
          { label: "Esgotados",         value: totalOutOfStock,     cls: "text-red-600" },
          { label: "Em campanha",       value: totalCampaign,       cls: "text-violet-600" },
        ].map(({ label, value, cls }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`mt-1.5 font-heading text-2xl font-extrabold ${cls}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
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
        <button
          onClick={() => setShowBulkModal(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
        >
          <Percent className="size-4" />
          Desconto em massa
        </button>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="size-4" />
          Novo produto
        </button>
      </div>

      {/* Table */}
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
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const inv = getItem(p.id)
                  const finalPrice = displayPrice(inv)
                  const available = isAvailable(inv)
                  const lowStock = inv.stock > 0 && inv.stock <= 5

                  return (
                    <tr key={p.id} className={`hover:bg-secondary/50 ${!available ? "opacity-60" : ""}`}>
                      {/* Produto */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                            <img
                              src={p.image || "/placeholder.svg"}
                              alt={p.name}
                              className="size-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium leading-snug text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.tag}</p>
                          </div>
                        </div>
                      </td>

                      {/* Estoque */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => adjustStock(p.id, -1)}
                            className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <Minus className="size-3" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={getStockInput(p.id)}
                            onChange={(e) => setStockInputs((prev) => ({ ...prev, [p.id]: e.target.value }))}
                            onBlur={() => commitStock(p.id)}
                            onKeyDown={(e) => e.key === "Enter" && commitStock(p.id)}
                            className="h-8 w-16 rounded-lg border border-input bg-background px-2 text-center text-sm outline-none ring-ring focus-visible:ring-2"
                          />
                          <button
                            onClick={() => adjustStock(p.id, 1)}
                            className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        {inv.stock === 0 && (
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
                          onClick={() => updateItem(p.id, { isActive: !inv.isActive })}
                          className="flex items-center gap-1.5 text-sm font-semibold"
                          title={inv.isActive ? "Clique para desativar" : "Clique para ativar"}
                        >
                          {inv.isActive ? (
                            <>
                              <ToggleRight className="size-5 text-emerald-600" />
                              <span className="text-emerald-700">Ativo</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="size-5 text-muted-foreground" />
                              <span className="text-muted-foreground">Inativo</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Preço base */}
                      <td className="px-5 py-4">
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={getPriceInput(p.id)}
                          onChange={(e) => setPriceInputs((prev) => ({ ...prev, [p.id]: e.target.value }))}
                          onBlur={() => commitPrice(p.id)}
                          onKeyDown={(e) => e.key === "Enter" && commitPrice(p.id)}
                          className="h-8 w-24 rounded-lg border border-input bg-background px-2 text-sm outline-none ring-ring focus-visible:ring-2"
                        />
                      </td>

                      {/* Campanha */}
                      <td className="px-5 py-4">
                        {inv.campaignPrice ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                            <Tag className="size-3" />
                            -{Math.round(((inv.basePrice - inv.campaignPrice) / inv.basePrice) * 100)}% OFF
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Preço final */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">R$ {formatBRL(finalPrice)}</p>
                        {inv.campaignPrice && (
                          <p className="text-xs text-muted-foreground line-through">
                            R$ {formatBRL(inv.basePrice)}
                          </p>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCampaignModal(p.id)}
                            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-violet-400 hover:text-violet-700"
                          >
                            Campanha
                          </button>
                          {!p.id.startsWith("custom-") && (
                            <Link
                              href={`/produtos/${p.id}`}
                              target="_blank"
                              className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
                              title="Ver no site"
                            >
                              <ExternalLink className="size-3.5" />
                            </Link>
                          )}
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
          {search && ` (filtrado de ${allProducts.length})`}
        </div>
      </div>

      {/* Campaign modal */}
      {campaignModal && campaignProduct && campaignInv && (
        <CampaignModal
          productName={campaignProduct.name}
          basePrice={campaignInv.basePrice}
          currentCampaignPrice={campaignInv.campaignPrice}
          onApply={(price) => applyCampaign(campaignModal, price)}
          onRemove={() => removeCampaign(campaignModal)}
          onClose={() => setCampaignModal(null)}
        />
      )}

      {/* Bulk discount modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-foreground">Desconto em massa</h3>
              <button onClick={() => setShowBulkModal(false)} className="rounded-full p-1 hover:bg-secondary">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Aplica o mesmo percentual de desconto em todos os produtos ativos.
            </p>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Desconto (%)</label>
            <input
              type="number"
              min="1"
              max="99"
              value={bulkPercent}
              onChange={(e) => setBulkPercent(e.target.value)}
              placeholder="Ex: 15"
              autoFocus
              className="mb-5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
            />
            {bulkPercent && !isNaN(parseFloat(bulkPercent)) && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold text-amber-800">
                  Isso afetará {totalActive} produto{totalActive !== 1 ? "s" : ""} ativos com -{bulkPercent}% de desconto.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkModal(false)}
                className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={applyBulkDiscount}
                disabled={!bulkPercent || isNaN(parseFloat(bulkPercent))}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Aplicar a todos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New product modal */}
      {showNewModal && (
        <NewProductModal
          onAdd={addCustomProduct}
          onClose={() => setShowNewModal(false)}
        />
      )}
    </>
  )
}
