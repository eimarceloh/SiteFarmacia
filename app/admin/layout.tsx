import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { usuarioTemPermissao } from "@/lib/rbac/verificar"
import { AdminShell } from "@/components/admin-shell"

export const metadata: Metadata = {
  title: { template: "%s | Admin — Farmácia do Povo", default: "Admin — Farmácia do Povo" },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Verifica permissão via banco — sem lógica hardcoded de nomes de papéis
  const autorizado = await usuarioTemPermissao("usuario.gerenciar")
  if (!autorizado) redirect("/acesso-negado")

  return <AdminShell>{children}</AdminShell>
}
