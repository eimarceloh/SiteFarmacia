import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getAllPrescriptions } from "@/lib/supabase/queries/prescriptions"
import { usuarioTemPermissao } from "@/lib/rbac/verificar"
import { ReceitasManager, type ReceitaItem } from "@/components/admin/receitas-manager"

export const metadata: Metadata = { title: "Receitas" }
export const dynamic = "force-dynamic"

export default async function ReceitasPage() {
  const pode = await usuarioTemPermissao("receita.ver")
  if (!pode) redirect("/acesso-negado")

  let receitas: ReceitaItem[] = []
  try {
    receitas = (await getAllPrescriptions(supabaseAdmin)) as ReceitaItem[]
  } catch {
    // Supabase indisponível — lista vazia
  }

  return <ReceitasManager receitas={receitas} />
}
