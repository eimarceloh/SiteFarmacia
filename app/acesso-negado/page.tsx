import Link from "next/link"
import type { Metadata } from "next"
import { ShieldX } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Acesso negado | Farmácia do Povo",
}

export default function AcessoNegadoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <ShieldX className="size-16 text-destructive" aria-hidden="true" />
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold text-foreground">Acesso negado</h1>
        <p className="max-w-sm text-muted-foreground text-balance">
          Você não tem permissão para acessar esta página.
          Se acredita que isso é um erro, entre em contato com o suporte.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/" className={cn(buttonVariants())}>
          Voltar à loja
        </Link>
        <Link href="/conta" className={cn(buttonVariants({ variant: "outline" }))}>
          Minha conta
        </Link>
      </div>
    </main>
  )
}
