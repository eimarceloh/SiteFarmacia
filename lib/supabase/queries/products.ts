// Queries de produtos — tipos de retorno explícitos para evitar
// inferência complexa dos genéricos do Supabase com TypeScript 5.7+
import type { SupabaseClient } from "@supabase/supabase-js"
import type {
  Product, ProductWithCategory, NewProduct, ProductReview
} from "../types"
import type { Product as SiteProduct } from "@/lib/products"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = SupabaseClient<any>

// Lista todos os produtos ativos com categoria
export async function getProducts(db: DB): Promise<ProductWithCategory[]> {
  const { data, error } = await db
    .from("produtos")
    .select("*, categorias(slug, titulo)")
    .eq("ativo", true)
    .order("ordem", { ascending: true })

  if (error) throw error
  return data as ProductWithCategory[]
}

// Produto por slug (para a página de detalhe)
export async function getProductBySlug(db: DB, slug: string): Promise<ProductWithCategory | null> {
  const { data, error } = await db
    .from("produtos")
    .select("*, categorias(slug, titulo)")
    .eq("slug", slug)
    .single()

  if (error) return null
  return data as ProductWithCategory
}

// Produtos por categoria
export async function getProductsByCategory(db: DB, categorySlug: string): Promise<ProductWithCategory[]> {
  const { data, error } = await db
    .from("produtos")
    .select("*, categorias(slug, titulo)")
    .eq("ativo", true)
    .order("ordem", { ascending: true })

  if (error) throw error
  const all = data as ProductWithCategory[]
  return all.filter((p) => p.categorias?.slug === categorySlug)
}

// Busca por nome, tag ou descrição
export async function searchProducts(db: DB, query: string): Promise<ProductWithCategory[]> {
  const { data, error } = await db
    .from("produtos")
    .select("*, categorias(slug, titulo)")
    .eq("ativo", true)
    .or(`nome.ilike.%${query}%,tag.ilike.%${query}%,descricao.ilike.%${query}%`)
    .order("ordem", { ascending: true })

  if (error) throw error
  return data as ProductWithCategory[]
}

// Admin: todos os produtos (incluindo inativos)
export async function getAllProductsAdmin(db: DB): Promise<ProductWithCategory[]> {
  const { data, error } = await db
    .from("produtos")
    .select("*, categorias(slug, titulo)")
    .order("ordem", { ascending: true })

  if (error) throw error
  return data as ProductWithCategory[]
}

// Admin: atualizar estoque e preço
export async function updateProductInventory(
  db: DB,
  productId: string,
  patch: {
    estoque?: number
    preco_base?: number
    preco_campanha?: number | null
    label_campanha?: string | null
    ativo?: boolean
  },
): Promise<Product> {
  const { data, error } = await db
    .from("produtos")
    .update(patch)
    .eq("id", productId)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

// Admin: debitar estoque após compra (usar supabaseAdmin para bypassar RLS)
export async function deductProductStock(db: DB, productId: string, quantity: number): Promise<void> {
  const { data: product, error: fetchError } = await db
    .from("produtos")
    .select("estoque")
    .eq("id", productId)
    .single()

  if (fetchError || !product) throw fetchError ?? new Error("Produto não encontrado")

  const { error } = await db
    .from("produtos")
    .update({ estoque: Math.max(0, (product as Product).estoque - quantity) })
    .eq("id", productId)

  if (error) throw error
}

// Admin: cadastrar novo produto
export async function createProduct(db: DB, product: NewProduct): Promise<Product> {
  const { data, error } = await db
    .from("produtos")
    .insert(product)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

// Avaliações aprovadas de um produto
export async function getProductReviews(db: DB, productId: string): Promise<ProductReview[]> {
  const { data, error } = await db
    .from("avaliacoes")
    .select("*")
    .eq("produto_id", productId)
    .eq("aprovado", true)
    .order("criado_em", { ascending: false })

  if (error) throw error
  return data as ProductReview[]
}

// ── Adaptador: Supabase → formato do site ────────────────────────────────────

export function adaptDbProduct(p: ProductWithCategory): SiteProduct {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cat = (p as any).categorias as { slug: string; titulo: string } | null
  const price    = (p as any).preco_campanha ?? (p as any).preco_base
  const oldPrice = (p as any).preco_campanha
    ? (p as any).preco_base
    : ((p as any).preco_original ?? (p as any).preco_base)
  return {
    id:          (p as any).slug,
    name:        (p as any).nome,
    tag:         (p as any).tag,
    categorySlug: cat?.slug ?? "",
    image:       (p as any).url_imagem ?? "",
    price,
    oldPrice,
    rating:      (p as any).media_avaliacao > 0
                   ? String(Number((p as any).media_avaliacao).toFixed(1))
                   : "5.0",
    reviewCount: (p as any).total_avaliacoes ?? 0,
    description: (p as any).descricao ?? "",
    benefits:    (p as any).beneficios ?? [],
    ingredients: (p as any).ingredientes ?? "",
    howToUse:    (p as any).modo_de_uso ?? "",
    reviews:     [],
    estoque:     (p as any).estoque ?? 0,
    ativo:       (p as any).ativo ?? true,
  }
}

// ── Helpers de negócio ───────────────────────────────────────────────────────

export function getDisplayPrice(product: Product): number {
  return product.preco_campanha ?? product.preco_base
}

export function getDiscountPercent(product: Product): number {
  const price = getDisplayPrice(product)
  const reference = product.preco_campanha ? product.preco_base : (product.preco_original ?? product.preco_base)
  if (reference <= price) return 0
  return Math.round(((reference - price) / reference) * 100)
}

export function isProductAvailable(product: Product): boolean {
  return product.ativo && product.estoque > 0
}
