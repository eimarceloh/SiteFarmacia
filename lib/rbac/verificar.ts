// Verificação de permissões — SEMPRE no backend, nunca confie só no frontend.
//
// Uso em Server Components / Server Actions:
//   await exigirPermissao(PERMISSOES.PRODUTO_CRIAR)     → redireciona se negado
//
// Uso em API Routes:
//   const { user, autorizado } = await verificarAuth(PERMISSOES.PEDIDO_VER_TODOS)
//   if (!autorizado) return Response.json({ erro: "Acesso negado" }, { status: 403 })

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { PermissaoChave } from "./tipos"

// ── Verificação simples ───────────────────────────────────────────────────────

/**
 * Retorna true se o usuário logado tem a permissão.
 * Retorna false se não autenticado ou se a permissão não está concedida ao papel.
 * Nega por padrão: sem permissão explícita = false.
 */
export async function usuarioTemPermissao(chave: PermissaoChave): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("fn_usuario_tem_permissao", {
    p_usuario_id: user.id,
    p_chave: chave,
  })
  return !error && data === true
}

// ── Para Server Components e Server Actions ───────────────────────────────────

/**
 * Lança redirect para /acesso-negado se o usuário não tiver a permissão.
 * Use em Server Components, layouts e Server Actions.
 */
export async function exigirPermissao(chave: PermissaoChave): Promise<void> {
  if (!(await usuarioTemPermissao(chave))) {
    redirect("/acesso-negado")
  }
}

/**
 * Exige que o usuário esteja autenticado.
 * Redireciona para /login se não estiver.
 */
export async function exigirAutenticacao(): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return user.id
}

// ── Para API Routes ───────────────────────────────────────────────────────────

/**
 * Retorna { user, autorizado } sem redirecionar.
 * Use em Route Handlers onde você precisa retornar 401/403 como Response.
 */
export async function verificarAuth(chave: PermissaoChave) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, autorizado: false }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).rpc("fn_usuario_tem_permissao", {
    p_usuario_id: user.id,
    p_chave: chave,
  })

  return { user, autorizado: data === true }
}

// ── Verificação de propriedade (ownership) ────────────────────────────────────

/**
 * Verifica se o usuário logado é dono de um registro.
 * Usa a RLS do Supabase: a query retorna nulo se o usuário não for dono.
 * Aplica-se a tabelas que têm política RLS de ownership (cliente_id = auth.uid()).
 */
export async function verificarPropriedade(
  tabela: "pedidos" | "enderecos" | "receitas",
  id: string,
): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from(tabela)
    .select("id")
    .eq("id", id)
    .maybeSingle()

  return data !== null
}

/**
 * Lógica combinada para pedidos:
 * - Se tem pedido.ver_todos → acesso total
 * - Se tem pedido.ver_proprios → acessa somente se for dono
 * - Caso contrário → negado
 */
export async function podeVerPedido(pedidoId: string): Promise<boolean> {
  if (await usuarioTemPermissao("pedido.ver_todos")) return true
  if (await usuarioTemPermissao("pedido.ver_proprios")) {
    return verificarPropriedade("pedidos", pedidoId)
  }
  return false
}
