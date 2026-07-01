"use client"

import { useActionState, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { ActionResult } from "@/app/admin/produtos/actions"
import { Loader2, Upload, X, Plus, Trash2 } from "lucide-react"

type Categoria = { id: string; titulo: string }

type ProdutoInicial = {
  id: string
  nome: string
  slug: string
  tag: string
  categoria_id: string | null
  url_imagem: string | null
  descricao: string
  beneficios: string[]
  ingredientes: string
  modo_de_uso: string
  preco_base: number
  preco_original: number | null
  preco_campanha: number | null
  label_campanha: string | null
  estoque: number
  ativo: boolean
  ordem: number
}

type Props = {
  categorias: Categoria[]
  inicial?: Partial<ProdutoInicial>
  action: (_: ActionResult, fd: FormData) => Promise<ActionResult>
  titulo: string
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80)
}

const inputCls =
  "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
const textareaCls =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-ring focus-visible:ring-2"

export function ProdutoForm({ categorias, inicial = {}, action, titulo }: Props) {
  const [nome,         setNome]         = useState(inicial.nome ?? "")
  const [slug,         setSlug]         = useState(inicial.slug ?? "")
  const [tag,          setTag]          = useState(inicial.tag ?? "")
  const [categoriaId,  setCategoriaId]  = useState(inicial.categoria_id ?? "")
  const [descricao,    setDescricao]    = useState(inicial.descricao ?? "")
  const [ingredientes, setIngredientes] = useState(inicial.ingredientes ?? "")
  const [modoDeUso,    setModoDeUso]    = useState(inicial.modo_de_uso ?? "")
  const [precoBase,    setPrecoBase]    = useState(String(inicial.preco_base ?? ""))
  const [precoOrig,    setPrecoOrig]    = useState(String(inicial.preco_original ?? ""))
  const [precoCamp,    setPrecoCamp]    = useState(String(inicial.preco_campanha ?? ""))
  const [labelCamp,    setLabelCamp]    = useState(inicial.label_campanha ?? "")
  const [estoque,      setEstoque]      = useState(String(inicial.estoque ?? "0"))
  const [ativo,        setAtivo]        = useState(inicial.ativo ?? true)
  const [ordem,        setOrdem]        = useState(String(inicial.ordem ?? "0"))
  const [beneficios,   setBeneficios]   = useState<string[]>(inicial.beneficios ?? [""])
  const [imagemUrl,    setImagemUrl]    = useState(inicial.url_imagem ?? "")
  const [uploading,    setUploading]    = useState(false)
  const [uploadError,  setUploadError]  = useState<string | null>(null)

  const [state, formAction, pending] = useActionState(action, {})

  function handleNomeChange(v: string) {
    setNome(v)
    if (!inicial.slug) setSlug(slugify(v))
  }

  async function handleImagemChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const supabase = createClient()
      const ext = file.name.split(".").pop() ?? "jpg"
      const path = `${slug || slugify(nome) || "produto"}-${Date.now()}.${ext}`
      const { data, error } = await supabase.storage
        .from("produtos")
        .upload(path, file, { upsert: true, contentType: file.type })
      if (error) throw error
      const { data: { publicUrl } } = supabase.storage.from("produtos").getPublicUrl(data.path)
      setImagemUrl(publicUrl)
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Erro ao fazer upload")
    } finally {
      setUploading(false)
    }
  }

  function addBeneficio() { setBeneficios((b) => [...b, ""]) }
  function removeBeneficio(i: number) { setBeneficios((b) => b.filter((_, idx) => idx !== i)) }
  function updateBeneficio(i: number, v: string) {
    setBeneficios((b) => b.map((x, idx) => (idx === i ? v : x)))
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {/* Campos hidden com valores state */}
      <input type="hidden" name="url_imagem"    value={imagemUrl} />
      <input type="hidden" name="beneficios"    value={JSON.stringify(beneficios.filter(Boolean))} />
      <input type="hidden" name="ativo"         value={String(ativo)} />
      <input type="hidden" name="nome"          value={nome} />
      <input type="hidden" name="slug"          value={slug} />
      <input type="hidden" name="tag"           value={tag} />
      <input type="hidden" name="categoria_id"  value={categoriaId} />
      <input type="hidden" name="descricao"     value={descricao} />
      <input type="hidden" name="ingredientes"  value={ingredientes} />
      <input type="hidden" name="modo_de_uso"   value={modoDeUso} />
      <input type="hidden" name="preco_base"    value={precoBase} />
      <input type="hidden" name="preco_original" value={precoOrig} />
      <input type="hidden" name="preco_campanha" value={precoCamp} />
      <input type="hidden" name="label_campanha" value={labelCamp} />
      <input type="hidden" name="estoque"       value={estoque} />
      <input type="hidden" name="ordem"         value={ordem} />

      {/* ── Cabeçalho ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">{titulo}</h1>
          <p className="text-sm text-muted-foreground">
            Todos os campos marcados com * são obrigatórios
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
          <div
            onClick={() => setAtivo((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition-colors ${ativo ? "bg-primary" : "bg-border"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${ativo ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          {ativo ? "Ativo" : "Inativo"}
        </label>
      </div>

      {state.error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {/* ── Informações básicas ── */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 font-heading text-base font-bold text-foreground">Informações básicas</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Nome do produto *</label>
            <input
              value={nome}
              onChange={(e) => handleNomeChange(e.target.value)}
              required
              placeholder="Ex: Colágeno Skin Glow"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Slug (URL) *
              <span className="ml-1 text-xs text-muted-foreground">gerado automaticamente</span>
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="colageno-skin-glow"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Tag / Rótulo *</label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
              placeholder="Ex: Beleza, Emagrecimento"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Categoria</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className={inputCls}
            >
              <option value="">Sem categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.titulo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Ordem de exibição</label>
            <input
              type="number"
              min="0"
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* ── Imagem ── */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 font-heading text-base font-bold text-foreground">Imagem do produto</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {imagemUrl ? (
            <div className="relative size-32 shrink-0">
              <img src={imagemUrl} alt="Preview" className="size-full rounded-xl border border-border object-cover" />
              <button
                type="button"
                onClick={() => setImagemUrl("")}
                className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white shadow"
              >
                <X className="size-3" />
              </button>
            </div>
          ) : (
            <div className="flex size-32 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary text-muted-foreground">
              <Upload className="size-6" />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2.5 text-center text-sm font-semibold text-foreground hover:bg-secondary">
              {uploading ? (
                <span className="flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Enviando…</span>
              ) : (
                "Escolher imagem"
              )}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImagemChange} disabled={uploading} />
            </label>
            <p className="text-xs text-muted-foreground">JPEG, PNG ou WebP · máximo 5 MB</p>
            {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
            <div className="mt-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Ou cole uma URL externa</label>
              <input
                type="url"
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder="https://..."
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none ring-ring focus-visible:ring-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Conteúdo ── */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 font-heading text-base font-bold text-foreground">Conteúdo</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Descrição *</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              rows={4}
              placeholder="Descreva o produto, seus diferenciais e para quem é indicado..."
              className={textareaCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Benefícios</label>
            <div className="flex flex-col gap-2">
              {beneficios.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={b}
                    onChange={(e) => updateBeneficio(i, e.target.value)}
                    placeholder={`Benefício ${i + 1}`}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => removeBeneficio(i)}
                    className="shrink-0 rounded-lg border border-border p-2.5 text-muted-foreground hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBeneficio}
                className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
              >
                <Plus className="size-4" /> Adicionar benefício
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Ingredientes / Ativos</label>
            <textarea
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
              rows={3}
              placeholder="Liste os ingredientes separados por vírgula ou em tópicos..."
              className={textareaCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Modo de uso</label>
            <textarea
              value={modoDeUso}
              onChange={(e) => setModoDeUso(e.target.value)}
              rows={3}
              placeholder="Instruções de como usar o produto..."
              className={textareaCls}
            />
          </div>
        </div>
      </section>

      {/* ── Preços ── */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 font-heading text-base font-bold text-foreground">Preços</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Preço de venda (R$) *</label>
            <input
              type="number"
              value={precoBase}
              onChange={(e) => setPrecoBase(e.target.value)}
              required
              min="0.01"
              step="0.01"
              placeholder="0,00"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Preço original (R$)
              <span className="ml-1 text-xs text-muted-foreground">exibido riscado</span>
            </label>
            <input
              type="number"
              value={precoOrig}
              onChange={(e) => setPrecoOrig(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="Deixe vazio se não houver"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Preço de campanha (R$)
              <span className="ml-1 text-xs text-muted-foreground">desconto temporário</span>
            </label>
            <input
              type="number"
              value={precoCamp}
              onChange={(e) => setPrecoCamp(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="Deixe vazio se não houver"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Rótulo da campanha
              <span className="ml-1 text-xs text-muted-foreground">ex: "Black Friday"</span>
            </label>
            <input
              value={labelCamp}
              onChange={(e) => setLabelCamp(e.target.value)}
              placeholder="Ex: Oferta relâmpago"
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* ── Estoque ── */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 font-heading text-base font-bold text-foreground">Estoque</h2>
        <div className="max-w-xs">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Quantidade em estoque</label>
          <input
            type="number"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            min="0"
            className={inputCls}
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="flex items-center justify-end gap-3">
        <a
          href="/admin/produtos"
          className="rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={pending || uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Salvar produto
        </button>
      </div>
    </form>
  )
}
