"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { exigirPermissao } from "@/lib/rbac/verificar"

export type ActionResult = { error?: string; success?: boolean }

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80)
}

// ── CRUD principal ────────────────────────────────────────────────────────────

export async function criarProduto(_: ActionResult, formData: FormData): Promise<ActionResult> {
  await exigirPermissao("produto.criar")
  const supabase = await createClient()

  const nome = formData.get("nome") as string
  const slug = (formData.get("slug") as string) || slugify(nome)

  const payload = {
    nome,
    slug,
    tag:           formData.get("tag") as string,
    categoria_id:  (formData.get("categoria_id") as string) || null,
    url_imagem:    (formData.get("url_imagem") as string) || null,
    descricao:     formData.get("descricao") as string,
    beneficios:    JSON.parse((formData.get("beneficios") as string) || "[]"),
    ingredientes:  formData.get("ingredientes") as string,
    modo_de_uso:   formData.get("modo_de_uso") as string,
    preco_base:    parseFloat(formData.get("preco_base") as string),
    preco_original: parseFloat(formData.get("preco_original") as string) || null,
    preco_campanha: parseFloat(formData.get("preco_campanha") as string) || null,
    label_campanha: (formData.get("label_campanha") as string) || null,
    estoque:       parseInt(formData.get("estoque") as string) || 0,
    ativo:         formData.get("ativo") === "true",
    ordem:         parseInt(formData.get("ordem") as string) || 0,
  }

  const { error } = await supabase.from("produtos").insert(payload)
  if (error) return { error: error.message }

  revalidatePath("/admin/produtos")
  revalidatePath("/")
  revalidatePath("/produtos")
  redirect("/admin/produtos")
}

export async function atualizarProduto(id: string, _: ActionResult, formData: FormData): Promise<ActionResult> {
  await exigirPermissao("produto.editar")
  const supabase = await createClient()

  const nome = formData.get("nome") as string
  const slug = (formData.get("slug") as string) || slugify(nome)

  const payload = {
    nome,
    slug,
    tag:           formData.get("tag") as string,
    categoria_id:  (formData.get("categoria_id") as string) || null,
    url_imagem:    (formData.get("url_imagem") as string) || null,
    descricao:     formData.get("descricao") as string,
    beneficios:    JSON.parse((formData.get("beneficios") as string) || "[]"),
    ingredientes:  formData.get("ingredientes") as string,
    modo_de_uso:   formData.get("modo_de_uso") as string,
    preco_base:    parseFloat(formData.get("preco_base") as string),
    preco_original: parseFloat(formData.get("preco_original") as string) || null,
    preco_campanha: parseFloat(formData.get("preco_campanha") as string) || null,
    label_campanha: (formData.get("label_campanha") as string) || null,
    estoque:       parseInt(formData.get("estoque") as string) || 0,
    ativo:         formData.get("ativo") === "true",
    ordem:         parseInt(formData.get("ordem") as string) || 0,
  }

  const { error } = await supabase.from("produtos").update(payload).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/produtos")
  revalidatePath("/")
  revalidatePath("/produtos")
  revalidatePath(`/produtos/${id}`, "page")
  redirect("/admin/produtos")
}

function revalidarPublico(slug?: string) {
  revalidatePath("/admin/produtos")
  revalidatePath("/")
  revalidatePath("/produtos")
  if (slug) revalidatePath(`/produtos/${slug}`, "page")
}

export async function toggleAtivo(id: string, ativo: boolean): Promise<ActionResult> {
  await exigirPermissao("produto.editar")
  const supabase = await createClient()
  const { error } = await supabase.from("produtos").update({ ativo }).eq("id", id)
  if (error) return { error: error.message }
  revalidarPublico()
  return { success: true }
}

export async function atualizarEstoque(id: string, estoque: number): Promise<ActionResult> {
  await exigirPermissao("estoque.gerenciar")
  const supabase = await createClient()
  const { error } = await supabase.from("produtos").update({ estoque }).eq("id", id)
  if (error) return { error: error.message }
  revalidarPublico()
  return { success: true }
}

export async function atualizarPreco(id: string, preco_base: number): Promise<ActionResult> {
  await exigirPermissao("produto.editar")
  const supabase = await createClient()
  const { error } = await supabase.from("produtos").update({ preco_base }).eq("id", id)
  if (error) return { error: error.message }
  revalidarPublico()
  return { success: true }
}

export async function aplicarCampanha(id: string, preco_campanha: number, label_campanha: string): Promise<ActionResult> {
  await exigirPermissao("produto.editar")
  const supabase = await createClient()
  const { error } = await supabase.from("produtos").update({ preco_campanha, label_campanha }).eq("id", id)
  if (error) return { error: error.message }
  revalidarPublico()
  return { success: true }
}

export async function removerCampanha(id: string): Promise<ActionResult> {
  await exigirPermissao("produto.editar")
  const supabase = await createClient()
  const { error } = await supabase.from("produtos").update({ preco_campanha: null, label_campanha: null }).eq("id", id)
  if (error) return { error: error.message }
  revalidarPublico()
  return { success: true }
}

export async function excluirProduto(id: string): Promise<ActionResult> {
  await exigirPermissao("produto.remover")
  const supabase = await createClient()
  const { error } = await supabase.from("produtos").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidarPublico()
  return { success: true }
}
