import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ShieldCheck, Star, ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Manipulação com qualidade farmacêutica
          </span>

          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
            Fórmulas feitas <span className="text-primary">sob medida</span> para a sua saúde
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
            Suplementos e medicamentos manipulados com a dosagem certa para o seu
            objetivo: emagrecimento, energia, beleza, cabelos e muito mais.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/produtos" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
              Ver produtos
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Button size="lg" variant="outline">
              Falar com farmacêutico
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">+120 mil</span> clientes atendidos
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-6 -top-6 size-40 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
            <img
              src="/images/hero-farmaceutica.png"
              alt="Farmacêutica segurando um frasco de suplemento manipulado em laboratório"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">Registro ANVISA</p>
              <p className="text-xs text-muted-foreground">Laboratório certificado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
