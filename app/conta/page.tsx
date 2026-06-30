import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AccountPanel } from "@/components/account-panel"

export const metadata: Metadata = {
  title: "Minha conta | Farmácia do Povo",
  description: "Gerencie seus pedidos, dados pessoais e endereços.",
}

export default function ContaPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <AccountPanel />
      <SiteFooter />
    </main>
  )
}
