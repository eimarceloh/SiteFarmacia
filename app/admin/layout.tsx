import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { minhasPermissoes } from "@/lib/rbac/verificar"
import { AdminShell } from "@/components/admin-shell"

export const metadata: Metadata = {
  title: { template: "%s | Admin — Farmácia do Povo", default: "Admin — Farmácia do Povo" },
}

// Qualquer uma destas permissões dá acesso ao painel (cada papel entra pela sua).
const PERMISSOES_ENTRADA = ["estoque.ver", "pedido.ver_todos", "receita.ver", "manipulacao.ver", "usuario.gerenciar"]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const permissoes = await minhasPermissoes()
  const podeEntrar = PERMISSOES_ENTRADA.some((p) => permissoes.includes(p))

  if (!podeEntrar) redirect("/acesso-negado")

  return <AdminShell permissoes={permissoes}>{children}</AdminShell>
}
