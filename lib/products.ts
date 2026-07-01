export type Review = {
  author: string
  rating: number
  text: string
  date: string
}

export type Product = {
  id: string
  name: string
  tag: string
  categorySlug: string
  image: string
  price: number
  oldPrice: number
  rating: string
  reviewCount: number
  description: string
  benefits: string[]
  ingredients: string
  howToUse: string
  reviews: Review[]
  // Campos opcionais para produtos vindos do Supabase
  estoque?: number
  ativo?: boolean
}

export const products: Product[] = [
  {
    id: "termo-slim",
    name: "Termo Slim Fórmula",
    tag: "Emagrecimento",
    categorySlug: "emagrecimento",
    image: "/images/produto-emagrecimento.png",
    price: 89.9,
    oldPrice: 119.9,
    rating: "4.9",
    reviewCount: 128,
    description:
      "Fórmula termogênica de alta performance desenvolvida para acelerar o metabolismo e potencializar a queima de gordura. Manipulada com ativos selecionados e controlada pelo farmacêutico responsável.",
    benefits: [
      "Acelera o metabolismo basal",
      "Reduz o apetite e a compulsão alimentar",
      "Aumenta a disposição e energia",
      "Auxilia na queima de gordura localizada",
    ],
    ingredients:
      "Cafeína anidra 200 mg, Extrato de chá verde (EGCG) 300 mg, Pimenta Cayenne (capsaicina 8%) 100 mg, Cromo picolinato 200 mcg, Vitamina B6 10 mg",
    howToUse:
      "Tomar 1 cápsula pela manhã e 1 cápsula no horário do almoço, com copo cheio de água. Não utilizar após as 18h. Não exceder 2 cápsulas ao dia. Consulte o farmacêutico responsável.",
    reviews: [
      { author: "Ana R.", rating: 5, text: "Perdi 6 kg em 2 meses com dieta e exercício. O controle do apetite foi notável desde a primeira semana.", date: "Mai 2025" },
      { author: "Fernanda S.", rating: 5, text: "Produto excelente! Minha energia aumentou muito e a balança finalmente começou a andar.", date: "Abr 2025" },
      { author: "Juliana M.", rating: 4, text: "Funciona bem, principalmente no controle da fome. Recomendo associar com exercícios para resultados mais rápidos.", date: "Mar 2025" },
    ],
  },
  {
    id: "detox-fit",
    name: "Detox Fit Complex",
    tag: "Emagrecimento",
    categorySlug: "emagrecimento",
    image: "/images/produto-emagrecimento.png",
    price: 79.9,
    oldPrice: 99.9,
    rating: "4.7",
    reviewCount: 94,
    description:
      "Complexo detox multifuncional que combina antioxidantes potentes, fibras e ativos depurativos para eliminar toxinas, desinchar e apoiar o emagrecimento saudável.",
    benefits: [
      "Elimina toxinas do organismo",
      "Reduz inchaço e retenção de líquidos",
      "Rica em antioxidantes",
      "Melhora o funcionamento intestinal",
    ],
    ingredients:
      "Alcachofra 300 mg, Cardo mariano 200 mg, Dente-de-leão 150 mg, Clorella 200 mg, Inulina 500 mg, Vitamina C 100 mg",
    howToUse:
      "Tomar 2 cápsulas ao dia, preferencialmente 30 minutos antes do café da manhã, com um copo grande de água. Manter hidratação adequada durante o uso.",
    reviews: [
      { author: "Carla M.", rating: 5, text: "Desinchei muito nas primeiras semanas. Meu abdômen ficou notavelmente mais liso.", date: "Jun 2025" },
      { author: "Patricia L.", rating: 4, text: "Ajudou bastante na digestão e no intestino preso que eu tinha. Recomendo!", date: "Abr 2025" },
    ],
  },
  {
    id: "capilar-force",
    name: "Capilar Force Complex",
    tag: "Queda Capilar",
    categorySlug: "queda-capilar",
    image: "/images/produto-capilar.png",
    price: 109.9,
    oldPrice: 139.9,
    rating: "4.8",
    reviewCount: 112,
    description:
      "Tratamento capilar de alta concentração com ativos específicos para combater a queda e estimular o crescimento dos fios de dentro para fora. Fórmula exclusiva da Farmácia do Povo.",
    benefits: [
      "Reduz a queda de cabelo em até 60%",
      "Estimula o crescimento dos fios",
      "Fortalece a raiz capilar",
      "Melhora a textura e o brilho dos cabelos",
    ],
    ingredients:
      "Biotina (vitamina B7) 10 mg, Zinco quelato 30 mg, L-Cisteína 500 mg, Pantotenato de cálcio 50 mg, Extrato de saw palmetto 300 mg, Ferro quelato 14 mg",
    howToUse:
      "Tomar 1 cápsula ao dia, preferencialmente com a refeição principal. Recomenda-se uso contínuo por no mínimo 90 dias para resultados satisfatórios.",
    reviews: [
      { author: "Bianca T.", rating: 5, text: "Em 3 meses de uso minha queda reduziu drasticamente. Cabelos muito mais fortes e com muito mais brilho.", date: "Mai 2025" },
      { author: "Renata F.", rating: 5, text: "Nunca vi resultado tão rápido. Depois de 45 dias já percebi diferença na escova.", date: "Mar 2025" },
      { author: "Marcos A.", rating: 4, text: "Usei por recomendação do dermatologista. A queda na têmpora diminuiu consideravelmente.", date: "Fev 2025" },
    ],
  },
  {
    id: "hair-grow",
    name: "Hair Grow Fórmula",
    tag: "Queda Capilar",
    categorySlug: "queda-capilar",
    image: "/images/produto-capilar.png",
    price: 119.9,
    oldPrice: 149.9,
    rating: "4.7",
    reviewCount: 87,
    description:
      "Fórmula regeneradora com complexo de aminoácidos e minerais essenciais para o crescimento acelerado dos fios e saúde do couro cabeludo.",
    benefits: [
      "Acelera o crescimento capilar",
      "Nutre o couro cabeludo em profundidade",
      "Aumenta a densidade dos fios",
      "Previne o enfraquecimento capilar",
    ],
    ingredients:
      "L-Metionina 500 mg, L-Cisteína 300 mg, Biotina 5 mg, Silício orgânico 100 mg, Extrato de cavalinha 200 mg, Selênio 55 mcg, Cobre 2 mg",
    howToUse:
      "Tomar 2 cápsulas ao dia, 1 pela manhã e 1 à noite, durante as refeições. Para melhores resultados, manter o uso por pelo menos 60 dias consecutivos.",
    reviews: [
      { author: "Larissa P.", rating: 5, text: "Meu cabelo cresceu quase 3 cm em 6 semanas! Totalmente impressionada com o resultado.", date: "Jun 2025" },
      { author: "Sofia N.", rating: 4, text: "Cabelo mais grosso e resistente. Queda diminuiu bastante após o primeiro mês.", date: "Abr 2025" },
    ],
  },
  {
    id: "imuni-vita",
    name: "Imuni Vita D3 + Zinco",
    tag: "Saúde",
    categorySlug: "saude",
    image: "/images/produto-imunidade.png",
    price: 69.9,
    oldPrice: 84.9,
    rating: "5.0",
    reviewCount: 203,
    description:
      "Suplemento imunológico completo com vitamina D3 de alta potência e zinco quelato para fortalecer as defesas do organismo e manter o bem-estar ao longo do ano.",
    benefits: [
      "Fortalece o sistema imunológico",
      "Combate a deficiência de vitamina D3",
      "Auxilia na saúde óssea e muscular",
      "Melhora o humor e os níveis de energia",
    ],
    ingredients:
      "Vitamina D3 (colecalciferol) 10.000 UI, Zinco quelato 30 mg, Vitamina K2 (MK-7) 100 mcg, Vitamina C 200 mg, Magnésio dimalato 150 mg",
    howToUse:
      "Tomar 1 cápsula ao dia junto à refeição principal. Não exceder a dose recomendada. Indicado após avaliação médica ou exame laboratorial.",
    reviews: [
      { author: "Roberto C.", rating: 5, text: "Resolvi o problema de deficiência de vitamina D sem precisar de receita cara. Exames mostraram melhora em 60 dias.", date: "Mai 2025" },
      { author: "Helena V.", rating: 5, text: "Não fico mais gripada toda semana. A imunidade melhorou visivelmente no inverno.", date: "Mar 2025" },
      { author: "Diego S.", rating: 5, text: "Melhor custo-benefício do mercado. Qualidade de manipulação impecável.", date: "Fev 2025" },
    ],
  },
  {
    id: "omega-ultra",
    name: "Ômega 3 Ultra DHA",
    tag: "Saúde",
    categorySlug: "saude",
    image: "/images/produto-imunidade.png",
    price: 74.9,
    oldPrice: 94.9,
    rating: "4.8",
    reviewCount: 156,
    description:
      "Ômega 3 ultra concentrado com alta proporção de DHA para saúde cardiovascular, cerebral e anti-inflamatória. Óleo de peixe purificado e livre de metais pesados.",
    benefits: [
      "Saúde cardiovascular",
      "Melhora a função cognitiva e memória",
      "Efeito anti-inflamatório natural",
      "Auxilia na redução dos triglicerídeos",
    ],
    ingredients:
      "Óleo de peixe concentrado 1000 mg (DHA 500 mg, EPA 250 mg), Vitamina E (tocoferol) 10 mg como antioxidante natural",
    howToUse:
      "Tomar 1 a 2 cápsulas ao dia durante as refeições. O acompanhamento médico é recomendado para uso em doses terapêuticas.",
    reviews: [
      { author: "Eduardo B.", rating: 5, text: "Meu cardiologista aprovou e os triglicerídeos caíram 40 pontos em 3 meses de uso.", date: "Jun 2025" },
      { author: "Claudia A.", rating: 4, text: "Sem gosto de peixe, cápsula fácil de engolir. Resultado nos exames foi ótimo.", date: "Abr 2025" },
    ],
  },
  {
    id: "colageno-skin",
    name: "Colágeno Skin Glow",
    tag: "Beleza",
    categorySlug: "beleza",
    image: "/images/produto-pele.png",
    price: 99.9,
    oldPrice: 129.9,
    rating: "4.9",
    reviewCount: 174,
    description:
      "Colágeno hidrolisado de alta biodisponibilidade enriquecido com vitamina C, ácido hialurônico e biotina para pele luminosa, firme e jovem de dentro para fora.",
    benefits: [
      "Reduz linhas de expressão e rugas finas",
      "Aumenta a firmeza e elasticidade da pele",
      "Hidratação profunda e duradoura",
      "Fortalece unhas e cabelos",
    ],
    ingredients:
      "Colágeno hidrolisado tipo I e III 5 g, Ácido hialurônico 100 mg, Vitamina C 200 mg, Biotina 5 mg, Coenzima Q10 50 mg",
    howToUse:
      "Tomar 2 cápsulas ao dia, preferencialmente pela manhã em jejum ou à noite antes de dormir. Uso contínuo por no mínimo 90 dias para resultados completos.",
    reviews: [
      { author: "Aline G.", rating: 5, text: "Minha pele ficou muito mais hidratada e firme. As linhas ao redor dos olhos diminuíram visivelmente.", date: "Jun 2025" },
      { author: "Tatiana R.", rating: 5, text: "Resultado surpreendente! Em 2 meses as pessoas perguntando o que eu tinha feito na pele.", date: "Mai 2025" },
      { author: "Vanessa M.", rating: 5, text: "As unhas pararam de quebrar e crescem muito mais rápido. Produto incrível.", date: "Abr 2025" },
    ],
  },
  {
    id: "beauty-complex",
    name: "Beauty Complex Pro",
    tag: "Beleza",
    categorySlug: "beleza",
    image: "/images/produto-pele.png",
    price: 89.9,
    oldPrice: 109.9,
    rating: "4.8",
    reviewCount: 98,
    description:
      "Complexo de beleza com nutrientes essenciais para pele, cabelo e unhas. Combinação inteligente de vitaminas, minerais e ativos botânicos para realçar sua beleza natural.",
    benefits: [
      "Pele mais luminosa e uniforme",
      "Unhas mais fortes e resistentes",
      "Cabelos brilhantes e saudáveis",
      "Rico em antioxidantes protetores",
    ],
    ingredients:
      "Biotina 10 mg, Vitamina E 400 UI, Vitamina C 500 mg, Selênio 100 mcg, Zinco quelato 15 mg, Extrato de semente de uva (resveratrol) 150 mg, Licopeno 10 mg",
    howToUse:
      "Tomar 1 cápsula ao dia com a refeição principal. Para melhores resultados, associar à alimentação equilibrada e hidratação adequada.",
    reviews: [
      { author: "Isabela C.", rating: 5, text: "Pele mais bonita, unhas crescendo e cabelo brilhoso. Tudo junto em um produto só. Amei!", date: "Mai 2025" },
      { author: "Mariana B.", rating: 4, text: "Ótimo custo-benefício para quem quer cuidar de tudo de uma vez. Recomendo!", date: "Mar 2025" },
    ],
  },
  {
    id: "pre-treino",
    name: "Pré-Treino Explosivo",
    tag: "Desempenho",
    categorySlug: "desempenho",
    image: "/images/produto-emagrecimento.png",
    price: 94.9,
    oldPrice: 119.9,
    rating: "4.9",
    reviewCount: 143,
    description:
      "Pré-treino de alta performance manipulado sob medida para dar energia máxima, força e resistência nos treinos mais intensos. Sem corantes artificiais e com dosagens clínicas.",
    benefits: [
      "Energia e disposição máxima no treino",
      "Aumento de força e resistência muscular",
      "Foco e concentração mental elevados",
      "Reduz a fadiga e o tempo de recuperação",
    ],
    ingredients:
      "Cafeína anidra 300 mg, Beta-alanina 3200 mg, Citrulina malato 6000 mg, Creatina monoidrato 3000 mg, L-Arginina 2000 mg, Vitamina B12 1000 mcg",
    howToUse:
      "Dissolver 1 dose em 300 ml de água fria e consumir 20 a 30 minutos antes do treino. Não utilizar após as 18h. Não combinar com outros estimulantes.",
    reviews: [
      { author: "Rafael O.", rating: 5, text: "Melhor pré-treino que já usei. Energia duradoura e sem aquela queda brusca no final.", date: "Jun 2025" },
      { author: "Lucas F.", rating: 5, text: "Quebrei PR no agachamento depois de 2 semanas usando. Muito bom mesmo!", date: "Mai 2025" },
      { author: "Thiago N.", rating: 4, text: "Foco excelente durante o treino. A formiga (beta-alanina) é forte no começo, mas passa rápido.", date: "Abr 2025" },
    ],
  },
  {
    id: "massa-max",
    name: "Massa Max Fórmula",
    tag: "Desempenho",
    categorySlug: "desempenho",
    image: "/images/produto-emagrecimento.png",
    price: 109.9,
    oldPrice: 139.9,
    rating: "4.7",
    reviewCount: 111,
    description:
      "Fórmula anabólica para ganho de massa muscular magra com combinação de proteínas de alto valor biológico, carboidratos complexos e micronutrientes essenciais para a hipertrofia.",
    benefits: [
      "Ganho de massa muscular magra",
      "Recuperação muscular acelerada",
      "Aumento da síntese proteica",
      "Fornece energia sustentada para treinos longos",
    ],
    ingredients:
      "Proteína do soro do leite (whey) 25 g, Caseína 10 g, Maltodextrina 20 g, Creatina monoidrato 3 g, L-Glutamina 2 g, Complexo de vitaminas do complexo B",
    howToUse:
      "Dissolver 1 dose em 300 a 400 ml de água ou leite e consumir após o treino. Para hipercalórico, preparar com leite integral. Ajuste a dose conforme orientação nutricional.",
    reviews: [
      { author: "Gustavo P.", rating: 5, text: "Ganhei 4 kg de massa em 3 meses. A recuperação muscular melhorou muito.", date: "Jun 2025" },
      { author: "Vinicius A.", rating: 4, text: "Sem estomago pesado como outros gainers. Fácil de digerir e gostoso com leite.", date: "Abr 2025" },
    ],
  },
  {
    id: "libido-plus",
    name: "Libido Plus Fórmula",
    tag: "Libido",
    categorySlug: "libido",
    image: "/images/produto-imunidade.png",
    price: 119.9,
    oldPrice: 149.9,
    rating: "4.8",
    reviewCount: 88,
    description:
      "Fórmula afrodisíaca natural com ativos clinicamente testados para estimular o desejo, melhorar o desempenho e restaurar a vitalidade sexual de forma segura e eficaz.",
    benefits: [
      "Aumenta o desejo e a libido",
      "Melhora o desempenho e a resistência",
      "Reduz o estresse e a ansiedade",
      "Equilíbrio hormonal natural",
    ],
    ingredients:
      "Tribulus terrestris 500 mg, Maca peruana 1000 mg, Ashwagandha (KSM-66) 300 mg, L-Arginina 1000 mg, Zinco quelato 30 mg, Vitamina D3 2000 UI",
    howToUse:
      "Tomar 2 cápsulas ao dia, 1 pela manhã e 1 à tarde, preferencialmente com as refeições. Para resultados ótimos, manter o uso por no mínimo 30 dias consecutivos.",
    reviews: [
      { author: "Carlos E.", rating: 5, text: "Resultado notável após 3 semanas. Voltei a me sentir como há 10 anos. Produto incrível.", date: "Mai 2025" },
      { author: "Alexandre M.", rating: 4, text: "Funciona de verdade. Energia e disposição melhoraram bastante também.", date: "Mar 2025" },
    ],
  },
  {
    id: "vitalidade-max",
    name: "Vitalidade Max",
    tag: "Libido",
    categorySlug: "libido",
    image: "/images/produto-imunidade.png",
    price: 99.9,
    oldPrice: 129.9,
    rating: "4.7",
    reviewCount: 76,
    description:
      "Suplemento revitalizante completo com adaptógenos naturais para restaurar a energia, equilibrar os hormônios e melhorar o bem-estar íntimo de forma progressiva.",
    benefits: [
      "Restaura a energia e a vitalidade",
      "Equilíbrio hormonal natural",
      "Reduz o estresse e o cansaço crônico",
      "Melhora o humor e a disposição diária",
    ],
    ingredients:
      "Ginseng coreano 400 mg, Ashwagandha 300 mg, Maca andina 500 mg, Vitamina B6 10 mg, Vitamina B12 500 mcg, Magnésio dimalato 200 mg, Zinco quelato 15 mg",
    howToUse:
      "Tomar 1 cápsula ao dia, preferencialmente pela manhã com o café da manhã. Uso contínuo por 30 a 90 dias para resultados progressivos.",
    reviews: [
      { author: "Paulo R.", rating: 5, text: "Cansaço crônico que eu tinha desapareceu em 30 dias. Energia de manhã até a noite.", date: "Jun 2025" },
      { author: "Nelson G.", rating: 4, text: "Produto discreto, boa embalagem e resultado efetivo. Vou continuar usando.", date: "Abr 2025" },
    ],
  },
]

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
