import Link from "next/link"
import type { Metadata } from "next"
import { CheckCircle2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { LogoIcon } from "@/components/logo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "E-mail confirmado | Farmácia do Povo",
}

export default function EmailConfirmadoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2 text-primary">
        <LogoIcon className="size-8" />
        <span className="font-heading text-xl font-bold tracking-tight">Farmácia do Povo</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="size-9 text-emerald-600" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-foreground">
          E-mail confirmado!
        </h1>

        <p className="mt-3 text-sm text-muted-foreground text-pretty">
          Sua conta foi ativada com sucesso. Você já pode fazer login e começar a acompanhar seus pedidos.
        </p>

        <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
          Enviamos um e-mail de boas-vindas com tudo que você precisa saber. Verifique sua caixa de entrada.
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
            Fazer login
          </Link>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "w-full")}
          >
            Explorar a loja
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Problemas para acessar?{" "}
        <Link href="/contato" className="text-primary hover:underline">
          Entre em contato
        </Link>
      </p>
    </div>
  )
}
