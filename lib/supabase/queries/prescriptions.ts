import type { SupabaseClient } from "@supabase/supabase-js"
import type { Prescription, NewPrescription } from "../types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = SupabaseClient<any>

// Criar receita
export async function createPrescription(db: DB, prescription: NewPrescription): Promise<Prescription> {
  const { data, error } = await db
    .from("receitas")
    .insert(prescription)
    .select()
    .single()

  if (error) throw error
  return data as Prescription
}

// Receitas do cliente logado
export async function getCustomerPrescriptions(db: DB, customerId: string): Promise<Prescription[]> {
  const { data, error } = await db
    .from("receitas")
    .select("*")
    .eq("cliente_id", customerId)
    .order("criado_em", { ascending: false })

  if (error) throw error
  return data as Prescription[]
}

// Admin: receitas pendentes de revisão
export async function getPendingPrescriptions(db: DB) {
  const { data, error } = await db
    .from("receitas")
    .select("*, clientes(nome_completo, email)")
    .eq("status", "aguardando_revisao")
    .order("criado_em", { ascending: true })

  if (error) throw error
  return data
}

// Admin: aprovar ou rejeitar receita
export async function reviewPrescription(
  db: DB,
  prescriptionId: string,
  status: "aprovado" | "rejeitado",
  reviewedBy: string,
  rejectionReason?: string,
): Promise<Prescription> {
  const { data, error } = await db
    .from("receitas")
    .update({
      status,
      revisado_por: reviewedBy,
      revisado_em: new Date().toISOString(),
      motivo_rejeicao: rejectionReason ?? null,
    })
    .eq("id", prescriptionId)
    .select()
    .single()

  if (error) throw error
  return data as Prescription
}
