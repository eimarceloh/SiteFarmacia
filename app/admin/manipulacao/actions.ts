"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { exigirPermissao } from "@/lib/rbac/verificar"
import type { OrderStatus } from "@/lib/orders"

export type ManipulacaoResult = { error?: string; success?: boolean }

// O manipulador avança o pedido da manipulação para o despacho.
export async function avancarManipulacao(
  pedidoId: string,
  novoStatus: OrderStatus,
): Promise<ManipulacaoResult> {
  await exigirPermissao("manipulacao.atualizar")

  // Só permite as transições válidas a partir da manipulação
  const permitidos: OrderStatus[] = ["despachado", "confirmado"]
  if (!permitidos.includes(novoStatus)) {
    return { error: "Transição de status inválida." }
  }

  const { error } = await supabaseAdmin
    .from("pedidos")
    .update({ status: novoStatus })
    .eq("id", pedidoId)

  if (error) return { error: error.message }

  revalidatePath("/admin/manipulacao")
  revalidatePath("/admin/pedidos")
  revalidatePath("/admin")
  return { success: true }
}
