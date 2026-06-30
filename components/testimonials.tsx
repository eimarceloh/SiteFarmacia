import { Star } from "lucide-react"

const reviews = [
  {
    name: "Mariana C.",
    role: "Cliente desde 2023",
    text: "A fórmula de emagrecimento mudou minha rotina. Atendimento dos farmacêuticos é impecável e a entrega foi super rápida.",
  },
  {
    name: "Rafael S.",
    role: "Cliente verificado",
    text: "Uso o complexo capilar há 3 meses e os resultados são visíveis. Recomendo demais, produto de altíssima qualidade.",
  },
  {
    name: "Juliana M.",
    role: "Cliente desde 2022",
    text: "Adoro poder ajustar a dosagem com orientação profissional. Me sinto segura comprando aqui sempre.",
  },
]

export function Testimonials() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Quem usa, aprova
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Mais de 120 mil clientes satisfeitos
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex" aria-label="5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-primary text-primary" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="text-pretty leading-relaxed text-foreground">
                “{r.text}”
              </blockquote>
              <figcaption className="mt-auto">
                <p className="font-semibold text-foreground">{r.name}</p>
                <p className="text-sm text-muted-foreground">{r.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
