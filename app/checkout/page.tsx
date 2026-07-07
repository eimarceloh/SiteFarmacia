import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutForm, type CheckoutInitial, type SavedAddress } from "@/components/checkout-form"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Checkout | Farmácia do Povo",
  description: "Finalize seu pedido com segurança.",
}

export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
  let initial: CheckoutInitial | undefined
  let addresses: SavedAddress[] = []

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [{ data: cliente }, { data: enderecos }] = await Promise.all([
        supabase
          .from("clientes")
          .select("nome_completo, email, telefone, cpf")
          .eq("id", user.id)
          .single(),
        supabase
          .from("enderecos")
          .select("id, rotulo, cep, logradouro, numero, complemento, bairro, cidade, estado, padrao")
          .eq("cliente_id", user.id)
          .order("padrao", { ascending: false }),
      ])

      const meta = user.user_metadata ?? {}
      initial = {
        nome:     cliente?.nome_completo || meta.nome_completo || "",
        email:    cliente?.email || user.email || "",
        telefone: cliente?.telefone || meta.telefone || "",
        cpf:      cliente?.cpf || meta.cpf || "",
      }
      addresses = (enderecos ?? []) as SavedAddress[]
    }
  } catch {
    // Sem sessão / Supabase indisponível — checkout como convidado (campos vazios)
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <CheckoutForm initial={initial} addresses={addresses} />
      <SiteFooter />
    </main>
  )
}
