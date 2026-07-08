import { Star, Quote } from "lucide-react"

const reviews = [
  {
    name: "Mariana C.",
    role: "Emagrecimento · Cliente desde 2023",
    text: "A fórmula de emagrecimento mudou minha rotina completamente. Perdi 8 kg em 3 meses com acompanhamento dos farmacêuticos. A entrega foi super rápida!",
    avatar: "MC",
    color: "bg-rose-100 text-rose-700",
  },
  {
    name: "Rafael S.",
    role: "Desempenho · Cliente verificado",
    text: "Uso o complexo para treino há 3 meses. Minha energia e recuperação muscular melhoraram muito. Produto de altíssima qualidade, sem comparação com o que achei no mercado.",
    avatar: "RS",
    color: "bg-blue-100 text-blue-700",
    featured: true,
  },
  {
    name: "Juliana M.",
    role: "Queda Capilar · Cliente desde 2022",
    text: "Meu cabelo estava caindo muito. Depois de 60 dias usando a fórmula manipulada, a queda diminuiu bastante e ficou muito mais forte. Me sinto segura comprando aqui.",
    avatar: "JM",
    color: "bg-emerald-100 text-emerald-700",
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
            Resultados reais de quem confia em nós
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className={`flex flex-col gap-5 rounded-2xl border p-6 transition-shadow hover:shadow-md ${
                r.featured
                  ? "border-primary/30 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card"
              }`}
            >
              {/* Ícone de quote */}
              <Quote className="size-8 text-primary/30" aria-hidden="true" />

              {/* Estrelas */}
              <div className="flex gap-0.5" aria-label="5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                ))}
              </div>

              <blockquote className="flex-1 text-base leading-relaxed text-foreground text-pretty">
                {r.text}
              </blockquote>

              <figcaption className="flex items-center gap-3">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${r.color}`}
                  aria-hidden="true"
                >
                  {r.avatar}
                </span>
                <div className="leading-tight">
                  <p className="font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
