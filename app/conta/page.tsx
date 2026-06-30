import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
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
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <AccountPanel />
      <SiteFooter />
    </main>
  )
}
