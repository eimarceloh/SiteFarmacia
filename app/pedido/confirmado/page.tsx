import Link from "next/link"
import { CheckCircle2, Package, Mail, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Pedido confirmado | Farmácia do Povo",
}

export default async function PedidoConfirmadoPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string; total?: string }>
}) {
  const { pedido, total } = await searchParams

  const orderNumber = pedido ?? "FP-000000"
  const orderTotal = total
    ? parseFloat(total).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-16 text-center md:py-24">

        {/* Ícone de sucesso */}
        <span className="flex size-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
        </span>

        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Pedido confirmado!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Obrigado pela sua compra na Farmácia do Povo.
          </p>
        </div>

        {/* Card com detalhes */}
        <div className="w-full rounded-2xl border border-border bg-card p-6 text-left">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-sm text-muted-foreground">Número do pedido</span>
            <span className="font-heading font-bold text-foreground">{orderNumber}</span>
          </div>

          {orderTotal && (
            <div className="flex items-center justify-between border-b border-border py-4">
              <span className="text-sm text-muted-foreground">Total pago</span>
              <span className="font-heading font-bold text-foreground">R$ {orderTotal}</span>
            </div>
          )}

          <div className="flex items-start gap-3 pt-4">
            <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Um e-mail de confirmação com todos os detalhes do pedido será enviado em breve.
            </p>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <Package className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Sua fórmula será manipulada e despachada em até <strong>2 dias úteis</strong>.
              A entrega ocorre em <strong>3 a 5 dias úteis</strong> após o envio.
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className={cn(buttonVariants({ size: "lg" }), "flex-1 gap-2")}
          >
            Continuar comprando
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/produtos"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex-1")}
          >
            Ver todos os produtos
          </Link>
        </div>

      </div>

      <SiteFooter />
    </main>
  )
}
