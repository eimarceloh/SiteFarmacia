"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { exigirPermissao } from "@/lib/rbac/verificar"

export type ReceitaResult = { error?: string; success?: boolean }

export async function revisarReceita(
  receitaId: string,
  status: "aprovado" | "rejeitado",
  motivo?: string,
): Promise<ReceitaResult> {
  await exigirPermissao("receita.validar")

  if (status === "rejeitado" && !motivo?.trim()) {
    return { error: "Informe o motivo da rejeição." }
  }

  // Identifica quem está revisando (para registrar em revisado_por)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabaseAdmin
    .from("receitas")
    .update({
      status,
      revisado_por: user?.id ?? null,
      revisado_em: new Date().toISOString(),
      motivo_rejeicao: status === "rejeitado" ? motivo!.trim() : null,
    })
    .eq("id", receitaId)

  if (error) return { error: error.message }

  revalidatePath("/admin/receitas")
  return { success: true }
}
