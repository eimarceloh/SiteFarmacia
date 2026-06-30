import { Check } from "lucide-react"

const points = [
  "Matérias-primas com laudo de procedência e pureza",
  "Controle de qualidade em todas as etapas da manipulação",
  "Equipe de farmacêuticos responsáveis disponível para você",
  "Embalagem segura e identificada com sua fórmula",
]

export function QualitySection() {
  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        <div className="relative order-2 overflow-hidden rounded-3xl border border-border shadow-lg md:order-1">
          <img
            src="/images/laboratorio.png"
            alt="Laboratório de manipulação com balança de precisão e frascos"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="order-1 flex flex-col gap-6 md:order-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Compromisso com a qualidade
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Um laboratório que você pode confiar
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
            Cada fórmula é preparada seguindo rígidos padrões de qualidade e
            boas práticas de manipulação, garantindo segurança e eficácia em
            cada dose.
          </p>
          <ul className="flex flex-col gap-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                <span className="text-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
