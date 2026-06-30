import Link from "next/link"
import { CheckCircle2, Circle, Clock, Package, Truck, MapPin, ChevronRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { STATUS_STYLES } from "@/lib/orders"
import type { Order } from "@/lib/orders"
import { formatBRL } from "@/lib/products"

const STEP_ICONS: Record<string, React.ElementType> = {
  confirmado:  CheckCircle2,
  manipulacao: Clock,
  despachado:  Package,
  transito:    Truck,
  entregue:    MapPin,
}

export function OrderTracking({ order }: { order: Order }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:py-12">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Início</Link>
        <ChevronRight className="size-4" />
        <Link href="/conta" className="hover:text-foreground">Minha conta</Link>
        <ChevronRight className="size-4" />
        <span className="text-foreground">Rastreio</span>
      </nav>

      {/* Header do pedido */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pedido</p>
            <p className="font-heading text-2xl font-extrabold text-foreground">{order.id}</p>
            <p className="mt-1 text-sm text-muted-foreground">Realizado em {order.date}</p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${STATUS_STYLES[order.status]}`}>
            {order.statusLabel}
          </span>
        </div>

        <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Previsão de entrega</p>
            <p className="mt-1 font-semibold text-foreground">{order.estimatedDelivery}</p>
          </div>
          {order.trackingCode && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Código de rastreio</p>
              <p className="mt-1 font-mono font-semibold text-foreground">{order.trackingCode}</p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-6 font-heading text-lg font-bold text-foreground">Acompanhamento</h2>
        <ol className="relative flex flex-col gap-0">
          {order.timeline.map((step, i) => {
            const Icon = STEP_ICONS[step.status] ?? Circle
            const isLast = i === order.timeline.length - 1

            return (
              <li key={step.status} className="relative flex gap-4">
                {/* Linha vertical conectora */}
                {!isLast && (
                  <div
                    className={`absolute left-[17px] top-9 h-full w-0.5 ${
                      step.done ? "bg-primary" : "bg-border"
                    }`}
                    aria-hidden="true"
                  />
                )}

                {/* Ícone do passo */}
                <div className="relative z-10 shrink-0">
                  <span
                    className={`flex size-9 items-center justify-center rounded-full border-2 ${
                      step.done
                        ? "border-primary bg-primary text-primary-foreground"
                        : step.active
                          ? "border-primary bg-background text-primary"
                          : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                </div>

                {/* Conteúdo */}
                <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                  <p className={`font-semibold leading-none ${
                    step.done || step.active ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.label}
                    {step.active && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        Atual
                      </span>
                    )}
                  </p>
                  {step.date && (
                    <p className="mt-1 text-xs text-muted-foreground">{step.date}</p>
                  )}
                  <p className={`mt-1.5 text-sm ${
                    step.done || step.active ? "text-muted-foreground" : "text-muted-foreground/50"
                  }`}>
                    {step.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Itens do pedido */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-foreground">Itens do pedido</h2>
        <ul className="divide-y divide-border">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center justify-between py-3">
              <span className="text-sm text-foreground">
                <span className="font-medium">{item.quantity}x</span> {item.name}
              </span>
              <span className="text-sm font-semibold text-foreground">
                R$ {formatBRL(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3">
          <span className="font-heading font-extrabold text-foreground">Total</span>
          <span className="font-heading font-extrabold text-foreground">R$ {formatBRL(order.total)}</span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/conta" className={cn(buttonVariants({ size: "lg" }), "flex-1")}>
          Voltar para minha conta
        </Link>
        <Link href="/produtos" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex-1")}>
          Continuar comprando
        </Link>
      </div>
    </div>
  )
}
