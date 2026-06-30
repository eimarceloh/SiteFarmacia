import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata: Metadata = {
  title: "Checkout | Farmácia do Povo",
  description: "Finalize seu pedido com segurança.",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <CheckoutForm />
      <SiteFooter />
    </main>
  )
}
