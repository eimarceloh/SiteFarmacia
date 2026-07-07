"use server"

import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { exigirPermissao } from "@/lib/rbac/verificar"
import type { OrderStatus } from "@/lib/orders"

export type ActionResult = { error?: string; success?: boolean }

export async function atualizarStatusPedido(
  pedidoId: string,
  status: OrderStatus,
): Promise<ActionResult> {
  await exigirPermissao("pedido.atualizar_status")

  const { error } = await supabaseAdmin
    .from("pedidos")
    .update({ status })
    .eq("id", pedidoId)

  if (error) return { error: error.message }

  revalidatePath("/admin/pedidos")
  revalidatePath("/admin")
  return { success: true }
}
