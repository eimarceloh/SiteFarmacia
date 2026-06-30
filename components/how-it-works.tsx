import { ClipboardList, FlaskConical, PackageCheck } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    title: "1. Escolha seu objetivo",
    desc: "Selecione a fórmula ou envie sua receita médica pelo site.",
  },
  {
    icon: FlaskConical,
    title: "2. Manipulamos sob medida",
    desc: "Nossos farmacêuticos preparam tudo com a dosagem exata para você.",
  },
  {
    icon: PackageCheck,
    title: "3. Receba em casa",
    desc: "Entrega rápida e segura para todo o Brasil, com rastreamento.",
  },
]

export function HowItWorks() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Simples e seguro
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Como funciona a manipulação
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-7" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
