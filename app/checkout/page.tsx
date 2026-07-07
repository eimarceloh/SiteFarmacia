import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutForm, type CheckoutInitial } from "@/components/checkout-form"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Checkout | Farmácia do Povo",
  description: "Finalize seu pedido com segurança.",
}

export const dynamic = "force-dynamic"

export default async function CheckoutPage() {
  let initial: CheckoutInitial | undefined

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const [{ data: cliente }, { data: endereco }] = await Promise.all([
        supabase
          .from("clientes")
          .select("nome_completo, email, telefone, cpf")
          .eq("id", user.id)
          .single(),
        supabase
          .from("enderecos")
          .select("cep, logradouro, numero, complemento, bairro, cidade, estado, padrao")
          .eq("cliente_id", user.id)
          .order("padrao", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

      const meta = user.user_metadata ?? {}
      initial = {
        nome:        cliente?.nome_completo || meta.nome_completo || "",
        email:       cliente?.email || user.email || "",
        telefone:    cliente?.telefone || meta.telefone || "",
        cpf:         cliente?.cpf || meta.cpf || "",
        cep:         endereco?.cep || "",
        logradouro:  endereco?.logradouro || "",
        numero:      endereco?.numero || "",
        complemento: endereco?.complemento || "",
        bairro:      endereco?.bairro || "",
        cidade:      endereco?.cidade || "",
        estado:      endereco?.estado || "",
      }
    }
  } catch {
    // Sem sessão / Supabase indisponível — checkout como convidado (campos vazios)
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <CheckoutForm initial={initial} />
      <SiteFooter />
    </main>
  )
}
