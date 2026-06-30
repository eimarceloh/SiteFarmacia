import { redirect } from "next/navigation"
import { Suspense } from "react"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Entrar | Farmácia do Povo",
  description: "Acesse sua conta para acompanhar pedidos e fórmulas manipuladas.",
}

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect("/conta")

  return (
    // useSearchParams() dentro de AuthForm exige Suspense no Next.js 15
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  )
}
