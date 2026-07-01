"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { exigirPermissao } from "@/lib/rbac/verificar"

export type EquipeActionResult = { error?: string; success?: boolean }

const PAPEIS_PERMITIDOS = ["atendente", "farmaceutico", "manipulador", "admin"] as const

export async function criarFuncionario(
  _: EquipeActionResult,
  formData: FormData,
): Promise<EquipeActionResult> {
  await exigirPermissao("usuario.gerenciar")

  const nome  = (formData.get("nome")  as string)?.trim()
  const email = (formData.get("email") as string)?.trim()
  const senha = formData.get("senha") as string
  const papel = formData.get("papel") as string

  if (!nome || !email || !senha || !papel) {
    return { error: "Preencha todos os campos obrigatórios." }
  }
  if (senha.length < 8) {
    return { error: "A senha deve ter no mínimo 8 caracteres." }
  }
  if (!PAPEIS_PERMITIDOS.includes(papel as typeof PAPEIS_PERMITIDOS[number])) {
    return { error: "Papel inválido." }
  }

  // 1. Cria o usuário no Supabase Auth (já confirma e-mail automaticamente)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome_completo: nome },
  })

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { error: "Este e-mail já está cadastrado no sistema." }
    }
    return { error: `Erro ao criar usuário: ${authError.message}` }
  }

  const userId = authData.user.id

  // 2. Busca o papel_id pelo nome
  const { data: perfil, error: perfilError } = await supabaseAdmin
    .from("perfis")
    .select("id")
    .eq("nome", papel)
    .single()

  if (perfilError || !perfil) {
    return { error: "Papel não encontrado no banco de dados." }
  }

  // 3. Atualiza clientes: nome + papel_id
  const { error: updateError } = await supabaseAdmin
    .from("clientes")
    .update({ nome_completo: nome, papel_id: perfil.id })
    .eq("id", userId)

  if (updateError) {
    return { error: `Usuário criado mas houve erro ao definir papel: ${updateError.message}` }
  }

  revalidatePath("/admin/equipe")
  return { success: true }
}

export async function alterarPapel(
  userId: string,
  novoPapel: string,
): Promise<EquipeActionResult> {
  await exigirPermissao("usuario.gerenciar")

  const { data: perfil } = await supabaseAdmin
    .from("perfis")
    .select("id")
    .eq("nome", novoPapel)
    .single()

  if (!perfil) return { error: "Papel não encontrado." }

  const { error } = await supabaseAdmin
    .from("clientes")
    .update({ papel_id: perfil.id })
    .eq("id", userId)

  if (error) return { error: error.message }
  revalidatePath("/admin/equipe")
  return { success: true }
}

export async function desativarFuncionario(userId: string): Promise<EquipeActionResult> {
  await exigirPermissao("usuario.gerenciar")

  const { error } = await supabaseAdmin
    .from("clientes")
    .update({ ativo: false })
    .eq("id", userId)

  if (error) return { error: error.message }
  revalidatePath("/admin/equipe")
  return { success: true }
}
