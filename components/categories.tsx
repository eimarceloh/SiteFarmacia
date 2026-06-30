import Link from "next/link"
import { Flame, Dumbbell, HeartPulse, Sparkles, Scissors, Star } from "lucide-react"

const categories = [
  { icon: Flame,     title: "Emagrecimento", desc: "Acelere o metabolismo",   slug: "emagrecimento" },
  { icon: Dumbbell,  title: "Desempenho",    desc: "Energia e força",          slug: "desempenho" },
  { icon: HeartPulse,title: "Saúde",         desc: "Bem-estar diário",         slug: "saude" },
  { icon: Scissors,  title: "Queda Capilar", desc: "Cabelos mais fortes",      slug: "queda-capilar" },
  { icon: Sparkles,  title: "Libido",        desc: "Vitalidade e desejo",      slug: "libido" },
  { icon: Star,      title: "Beleza",        desc: "Pele, unhas e cabelos",    slug: "beleza" },
]

export function Categories() {
  return (
    <section id="categorias" className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Por objetivo
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            Encontre a fórmula ideal para você
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {categories.map(({ icon: Icon, title, desc, slug }) => (
            <Link
              key={slug}
              href={`/categoria/${slug}`}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-heading text-base font-bold text-foreground md:text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
