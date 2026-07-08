import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Escolha seu objetivo",
    desc: "Selecione a fórmula ideal ou envie sua receita médica. Nossos farmacêuticos te orientam em cada passo.",
    color: "bg-primary/10 text-primary",
  },
  {
    number: "02",
    title: "Manipulamos para você",
    desc: "Cada cápsula ou frasco é preparado com a dosagem exata para o seu corpo, com matérias-primas de alta pureza.",
    color: "bg-primary/10 text-primary",
  },
  {
    number: "03",
    title: "Receba onde quiser",
    desc: "Entrega para todo o Brasil com rastreamento em tempo real. Embalagem segura e discreta.",
    color: "bg-primary/10 text-primary",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Simples e rápido
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Da escolha à sua porta em 3 passos
          </h2>
        </div>

        {/* Steps com linha conectora no desktop */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Linha decorativa */}
          <div
            className="absolute left-0 right-0 top-[2.25rem] hidden border-t-2 border-dashed border-border md:block"
            aria-hidden="true"
          />

          {steps.map(({ number, title, desc, color }) => (
            <div key={number} className="relative flex flex-col items-center gap-5 text-center">
              {/* Número */}
              <div
                className={cn(
                  "relative z-10 flex size-16 items-center justify-center rounded-full border-4 border-background font-heading text-xl font-extrabold shadow-md",
                  color,
                )}
              >
                {number}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/produtos"
            className={cn(buttonVariants({ size: "lg" }), "gap-2 rounded-full px-8")}
          >
            Começar agora
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
