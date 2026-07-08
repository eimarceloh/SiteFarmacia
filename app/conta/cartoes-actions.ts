"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// ⚠️ Este módulo NUNCA recebe o número completo do cartão (PAN) nem o CVV.
// O componente de UI deriva bandeira + últimos 4 no navegador e envia somente
// os dados não sensíveis abaixo. Em produção, o ideal é tokenizar o cartão no
// gateway (Stripe/Pagar.me/Mercado Pago) e persistir o token em token_gateway.

export type CartaoResult = { error?: string; success?: boolean }

export type CartaoInput = {
  bandeira: string
  ultimos4: string
  validade_mes: number
  validade_ano: number
  nome_titular: string
  token_gateway?: string | null
  padrao: boolean
}

function validar(c: CartaoInput): string | null {
  if (!c.nome_titular?.trim()) return "Informe o nome do titular."
  if (!/^[0-9]{4}$/.test(c.ultimos4)) return "Cartão inválido."
  if (!c.bandeira?.trim()) return "Não foi possível identificar a bandeira do cartão."
  if (!(c.validade_mes >= 1 && c.validade_mes <= 12)) return "Mês de validade inválido."

  const hoje = new Date()
  const anoAtual = hoje.getFullYear()
  if (c.validade_ano < anoAtual || c.validade_ano > anoAtual + 20) return "Ano de validade inválido."
  // Cartão expirado?
  if (c.validade_ano === anoAtual && c.validade_mes < hoje.getMonth() + 1) {
    return "Este cartão está vencido."
  }
  return null
}

export async function salvarCartao(input: CartaoInput): Promise<CartaoResult> {
  const erro = validar(input)
  if (erro) return { error: erro }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sessão expirada. Faça login novamente." }

  const { error } = await supabase.from("cartoes").insert({
    cliente_id:    user.id,
    bandeira:      input.bandeira.trim().toLowerCase(),
    ultimos4:      input.ultimos4,
    validade_mes:  input.validade_mes,
    validade_ano:  input.validade_ano,
    nome_titular:  input.nome_titular.trim().toUpperCase(),
    token_gateway: input.token_gateway ?? null,
    padrao:        input.padrao,
  })

  if (error) return { error: error.message }

  revalidatePath("/conta")
  return { success: true }
}

export async function excluirCartao(id: string): Promise<CartaoResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sessão expirada. Faça login novamente." }

  const { error } = await supabase.from("cartoes").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/conta")
  return { success: true }
}

export async function definirCartaoPadrao(id: string): Promise<CartaoResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Sessão expirada. Faça login novamente." }

  // O trigger fn_cartao_padrao_unico zera os demais padrões automaticamente.
  const { error } = await supabase.from("cartoes").update({ padrao: true }).eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/conta")
  return { success: true }
}
