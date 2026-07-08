import Link from "next/link"
import { ArrowRight } from "lucide-react"

const categories = [
  {
    title: "Emagrecimento",
    desc: "Acelere o metabolismo e conquiste seu peso ideal",
    slug: "emagrecimento",
    image: "/images/cat-emagrecimento.png",
    span: "md:col-span-2",
  },
  {
    title: "Desempenho",
    desc: "Energia e força para ir além",
    slug: "desempenho",
    image: "/images/cat-desempenho.png",
    span: "",
  },
  {
    title: "Saúde",
    desc: "Bem-estar no dia a dia",
    slug: "saude",
    image: "/images/cat-saude.png",
    span: "",
  },
  {
    title: "Queda Capilar",
    desc: "Cabelos mais fortes e saudáveis",
    slug: "queda-capilar",
    image: "/images/cat-capilar.png",
    span: "",
  },
  {
    title: "Libido",
    desc: "Vitalidade e disposição",
    slug: "libido",
    image: "/images/cat-libido.png",
    span: "",
  },
  {
    title: "Beleza",
    desc: "Pele, unhas e muito mais",
    slug: "beleza",
    image: "/images/cat-beleza.png",
    span: "md:col-span-2",
  },
]

export function Categories() {
  return (
    <section id="categorias" className="bg-muted py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-col gap-1">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Por objetivo
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
            O que você quer transformar?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {categories.map(({ title, desc, slug, image, span }) => (
            <Link
              key={slug}
              href={`/categoria/${slug}`}
              className={`group relative overflow-hidden rounded-2xl ${span}`}
              aria-label={`Ver produtos de ${title}`}
            >
              {/* Imagem de fundo */}
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Overlay escuro */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
                aria-hidden="true"
              />

              {/* Texto */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-white md:text-lg">{title}</h3>
                  <p className="mt-0.5 text-xs text-white/75 text-pretty">{desc}</p>
                </div>
                <span className="flex size-8 shrink-0 translate-x-2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
