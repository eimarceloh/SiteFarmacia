import { Suspense } from "react"
import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Entrar | Farmácia do Povo",
  description: "Acesse sua conta para acompanhar pedidos e fórmulas manipuladas.",
}

export default function LoginPage() {
  return (
    // useSearchParams() dentro de AuthForm exige Suspense no Next.js 15
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  )
}
