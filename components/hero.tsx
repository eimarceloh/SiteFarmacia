import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight, Star, Truck, ShieldCheck, CreditCard } from "lucide-react"

const seals = [
  { icon: ShieldCheck, label: "ANVISA certificado" },
  { icon: Truck,       label: "Frete grátis acima de R$ 199" },
  { icon: CreditCard,  label: "12x sem juros" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Hero grid */}
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20 lg:gap-16">

        {/* Left — copy */}
        <div className="flex flex-col gap-7">
          <div className="flex items-center gap-2">
            <div className="flex" aria-label="5 estrelas">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              +120 mil clientes satisfeitos
            </span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
            Cuide do seu corpo do jeito{" "}
            <span className="relative whitespace-nowrap text-primary">
              certo para você
            </span>
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            Fórmulas manipuladas com a sua dosagem exata — para emagrecer,
            ganhar energia, fortalecer cabelos ou cuidar da pele. Tudo sob
            orientação farmacêutica.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/produtos"
              className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full px-8")}
            >
              Descobrir minha fórmula
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contato"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full px-8")}
            >
              Falar com farmacêutico
            </Link>
          </div>

          {/* Mini selos */}
          <div className="flex flex-wrap gap-4 border-t border-border pt-6">
            {seals.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — imagem lifestyle */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <img
              src="/images/hero-lifestyle.png"
              alt="Mulher sorrindo segurando um frasco de suplemento manipulado"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          {/* Card flutuante — resultado */}
          <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl md:-left-6">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10">
              <Star className="size-5 fill-amber-400 text-amber-400" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground">4.9 / 5 estrelas</p>
              <p className="text-xs text-muted-foreground">Avaliado por +8.400 clientes</p>
            </div>
          </div>

          {/* Card flutuante — desconto */}
          <div className="absolute -right-4 top-8 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl md:-right-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Primeira compra</p>
            <p className="text-2xl font-extrabold text-foreground">10% off</p>
            <p className="text-xs text-muted-foreground">com o cupom BEMVINDO</p>
          </div>
        </div>
      </div>
    </section>
  )
}
