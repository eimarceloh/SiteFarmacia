export type Category = {
  slug: string
  title: string
  desc: string
  longDesc: string
  icon: string
}

export const categories: Category[] = [
  {
    slug: "emagrecimento",
    title: "Emagrecimento",
    desc: "Acelere o metabolismo",
    longDesc: "Fórmulas manipuladas para auxiliar na perda de peso com segurança, acelerando o metabolismo e controlando o apetite.",
    icon: "Flame",
  },
  {
    slug: "desempenho",
    title: "Desempenho",
    desc: "Energia e força",
    longDesc: "Suplementos personalizados para maximizar seu rendimento nos treinos, ganho de massa muscular e recuperação.",
    icon: "Dumbbell",
  },
  {
    slug: "saude",
    title: "Saúde",
    desc: "Bem-estar diário",
    longDesc: "Vitaminas, minerais e compostos para fortalecer a imunidade e manter o equilíbrio do organismo todos os dias.",
    icon: "HeartPulse",
  },
  {
    slug: "queda-capilar",
    title: "Queda Capilar",
    desc: "Cabelos mais fortes",
    longDesc: "Tratamentos manipulados com ativos específicos para combater a queda, estimular o crescimento e fortalecer os fios.",
    icon: "Scissors",
  },
  {
    slug: "libido",
    title: "Libido",
    desc: "Vitalidade e desejo",
    longDesc: "Fórmulas naturais para potencializar a vitalidade, o desejo e o bem-estar íntimo com segurança e eficácia.",
    icon: "Sparkles",
  },
  {
    slug: "beleza",
    title: "Beleza",
    desc: "Pele, unhas e cabelos",
    longDesc: "Compostos de colágeno, vitaminas e ativos dermatológicos para realçar sua beleza de dentro para fora.",
    icon: "Star",
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}
