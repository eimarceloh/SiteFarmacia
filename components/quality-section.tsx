import { Check, Users, Award, Clock } from "lucide-react"

const stats = [
  { icon: Users, value: "+120 mil", label: "clientes atendidos" },
  { icon: Award, value: "100%",     label: "aprovados pela ANVISA" },
  { icon: Clock, value: "2 dias",   label: "prazo de manipulação" },
]

const points = [
  "Matérias-primas com laudo de procedência e pureza",
  "Controle de qualidade em todas as etapas",
  "Equipe de farmacêuticos disponível para você",
  "Embalagem identificada com a sua fórmula",
]

export function QualitySection() {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Stats strip */}
        <div className="mb-14 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-6 md:p-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <Icon className="mb-1 size-6 text-primary" aria-hidden="true" />
              <span className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">{value}</span>
              <span className="text-xs text-muted-foreground text-pretty md:text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Content grid */}
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative order-2 overflow-hidden rounded-3xl shadow-xl md:order-1">
            <img
              src="/images/laboratorio.png"
              alt="Farmacêutico trabalhando no laboratório de manipulação"
              className="aspect-[4/3] w-full object-cover"
            />
            {/* Badge sobre a imagem */}
            <div className="absolute bottom-4 right-4 rounded-xl bg-card/95 px-4 py-2 shadow-lg backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Certificado</p>
              <p className="text-sm font-bold text-foreground">Boas Práticas ANVISA</p>
            </div>
          </div>

          <div className="order-1 flex flex-col gap-6 md:order-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Qualidade que você sente
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
              Cada fórmula feita com cuidado, do início ao fim
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
              Não existe produto padrão aqui. Tudo é preparado especialmente para
              você — com a dosagem certa, ingredientes puros e supervisão
              farmacêutica em cada etapa.
            </p>
            <ul className="flex flex-col gap-3" aria-label="Compromissos de qualidade">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    aria-hidden="true"
                  >
                    <Check className="size-3" />
                  </span>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
