import { Suspense } from "react"
import type { Metadata } from "next"
import { AuthForm } from "@/components/auth-form"

export const metadata: Metadata = {
  title: "Criar conta | Farmácia do Povo",
  description: "Cadastre-se e compre fórmulas manipuladas com mais agilidade.",
}

export default function CadastroPage() {
  return (
    // useSearchParams() dentro de AuthForm exige Suspense no Next.js 15
    <Suspense>
      <AuthForm mode="cadastro" />
    </Suspense>
  )
}
