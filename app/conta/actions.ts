"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type EnderecoResult = { error?: string; success?: boolean }

export type EnderecoInput = {
  id?: string
  rotulo: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  padrao: boolean
}

function validar(e: EnderecoInput): string | null {
  if (!e.logradouro?.trim()) return "Informe o logradouro."
  if (!e.numero?.trim())     return "Informe o número."
  if (!e.bairro?.trim())     return "Informe o bairro."
  if (!e.cidade?.trim())     return "Informe a cidade."
  if (!e.estado?.trim() || e.estado.trim().length !== 2) return "Informe a UF (2 letras)."
  if (e.cep.replace(/\D/g, "").length !== 8) return "CEP inválido."
  return null
}

// Cria ou atualiza um endereço do usuário logado.
// A RLS garante que só o dono grave; o trigger garante 1 padrão por cliente.
export async function salvarEndereco(input: EnderecoInput): Promise<EnderecoResult> {
  const erro = validar(input)
  if (erro) return { error: erro }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sessão expirada. Faça login novamente." }

  const payload = {
    cliente_id:  user.id,
    rotulo:      input.rotulo?.trim() || "Casa",
    logradouro:  input.logradouro.trim(),
    numero:      input.numero.trim(),
    complemento: input.complemento?.trim() || null,
    bairro:      input.bairro.trim(),
    cidade:      input.cidade.trim(),
    estado:      input.estado.trim().toUpperCase(),
    cep:         input.cep.replace(/\D/g, ""),
    padrao:      input.padrao,
  }

  const { error } = input.id
    ? await supabase.from("enderecos").update(payload).eq("id", input.id)
    : await supabase.from("enderecos").insert(payload)

  if (error) return { error: error.message }

  revalidatePath("/conta")
  return { success: true }
}

export async function excluirEndereco(id: string): Promise<EnderecoResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sessão expirada. Faça login novamente." }

  const { error } = await supabase.from("enderecos").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/conta")
  return { success: true }
}

export async function definirEnderecoPadrao(id: string): Promise<EnderecoResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sessão expirada. Faça login novamente." }

  // O trigger fn_endereco_padrao_unico zera os demais padrões automaticamente.
  const { error } = await supabase.from("enderecos").update({ padrao: true }).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/conta")
  return { success: true }
}
