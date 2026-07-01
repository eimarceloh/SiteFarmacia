import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { usuarioTemPermissao } from "@/lib/rbac/verificar"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AccountPanel } from "@/components/account-panel"

export const metadata: Metadata = {
  title: "Minha conta | Farmácia do Povo",
  description: "Gerencie seus pedidos, dados pessoais e endereços.",
}

export default async function ContaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?redirect=/conta")

  const [{ data: cliente }, { data: pedidos }, { data: enderecos }, podeAcessarAdmin] = await Promise.all([
    supabase
      .from("clientes")
      .select("nome_completo, email, telefone, cpf")
      .eq("id", user.id)
      .single(),
    supabase
      .from("pedidos")
      .select("id, numero_pedido, status, subtotal, total, criado_em, itens_pedido(nome_produto, quantidade, preco_unitario)")
      .eq("cliente_id", user.id)
      .order("criado_em", { ascending: false }),
    supabase
      .from("enderecos")
      .select("id, rotulo, logradouro, numero, complemento, bairro, cidade, estado, cep, padrao")
      .eq("cliente_id", user.id)
      .order("padrao", { ascending: false }),
    usuarioTemPermissao("estoque.ver"),
  ])

  const meta = user.user_metadata ?? {}

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <AccountPanel
        nome={cliente?.nome_completo || meta.nome_completo || ""}
        email={cliente?.email || user.email || ""}
        telefone={cliente?.telefone || meta.telefone || ""}
        cpf={cliente?.cpf || meta.cpf || ""}
        pedidos={pedidos ?? []}
        enderecos={enderecos ?? []}
        podeAcessarAdmin={podeAcessarAdmin}
      />
      <SiteFooter />
    </main>
  )
}
