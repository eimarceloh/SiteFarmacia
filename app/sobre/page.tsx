import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ShieldCheck, HeartHandshake, Sparkles,
  FlaskConical, Users, PackageCheck, Star, ArrowRight,
  Check,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Sobre nós | Farmácia do Povo",
  description: "Conheça a história, os valores e a equipe da Farmácia do Povo.",
}

const stats = [
  { value: "9+",     label: "Anos de experiência" },
  { value: "+120k",  label: "Clientes atendidos" },
  { value: "+800",   label: "Fórmulas disponíveis" },
  { value: "27",     label: "Estados com entrega" },
]

const values = [
  {
    icon: ShieldCheck,
    title: "Qualidade sem concessões",
    desc: "Cada fórmula segue rigorosos padrões farmacêuticos com matérias-primas rastreadas e laudos de pureza em todas as etapas.",
  },
  {
    icon: HeartHandshake,
    title: "Acessibilidade para todos",
    desc: "Acreditamos que a saúde personalizada não deve ser privilégio. Praticamos preços justos sem abrir mão da excelência.",
  },
  {
    icon: Sparkles,
    title: "Transparência total",
    desc: "Informação clara sobre cada ingrediente, dosagem e procedência. Você sabe exatamente o que está colocando no seu corpo.",
  },
]

const team = [
  {
    name: "Dra. Ana Paula Souza",
    role: "Farmacêutica Responsável",
    crm: "CRF 12.345-SP",
    bio: "Especialista em Farmácia Magistral com 12 anos de experiência em manipulação de fórmulas para saúde metabólica e estética.",
  },
  {
    name: "Dr. Carlos Mendes",
    role: "Farmacêutico Clínico",
    crm: "CRF 23.456-SP",
    bio: "Pós-graduado em Farmácia Clínica e Atenção Farmacêutica. Especialista em suplementação esportiva e performance.",
  },
  {
    name: "Dra. Juliana Ferreira",
    role: "Especialista em Fitoterapia",
    crm: "CRF 34.567-SP",
    bio: "Mestre em Farmacognosia com foco em plantas medicinais e fitoterápicos. Referência em fórmulas naturais e adaptógenos.",
  },
]

const historyPoints = [
  "Fundada em 2015 por três farmacêuticos apaixonados por manipulação",
  "Em 2018 expandimos para atendimento online em todo o Brasil",
  "Em 2021 inauguramos nosso novo laboratório certificado pela ANVISA",
  "Hoje somos referência em farmácia magistral acessível e de qualidade",
]

const certifications = [
  "Registro e Autorização de Funcionamento ANVISA",
  "Boas Práticas de Manipulação (RDC 67/2007)",
  "Laudos de identidade e pureza de matérias-primas",
  "Controle de qualidade em todas as etapas",
]

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-primary py-16 text-primary-foreground md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium">
              <FlaskConical className="size-4" aria-hidden="true" />
              Desde 2015
            </span>
            <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-balance md:text-5xl">
              Farmácia do povo, feita para o povo
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-primary-foreground/80 text-pretty">
              Nascemos com um propósito simples: tornar a manipulação farmacêutica de alta qualidade acessível a quem realmente precisa.
            </p>
            <Link
              href="/contato"
              className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "w-fit gap-2")}
            >
              Fale com a gente
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl border border-primary-foreground/20 shadow-xl">
            <img
              src="/images/laboratorio.png"
              alt="Laboratório de manipulação da Farmácia do Povo"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-0 px-4 md:grid-cols-4">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-1 py-10 text-center ${
                i < stats.length - 1 ? "border-r border-border" : ""
              }`}
            >
              <span className="font-heading text-4xl font-extrabold text-primary">{value}</span>
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Nossa história */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Nossa história</p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
              Uma farmácia nascida da vontade de mudar o acesso à saúde
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground text-pretty">
              A Farmácia do Povo foi fundada em 2015 por três farmacêuticos que acreditavam que manipulação de qualidade não precisava ser cara. Começamos em um pequeno laboratório em São Paulo e hoje atendemos clientes em todo o Brasil.
            </p>
            <ul className="flex flex-col gap-3">
              {historyPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border shadow-lg">
            <img
              src="/images/hero-farmaceutica.png"
              alt="Farmacêutica trabalhando no laboratório"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Nossos valores */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              O que nos guia
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
              Nossos valores
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, desc }) => (
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

      {/* Nossa equipe */}
      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Quem cuida de você
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
              Nossa equipe farmacêutica
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {team.map(({ name, role, crm, bio }) => (
              <div
                key={name}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 font-heading text-2xl font-extrabold text-primary">
                  {name.split(" ")[1][0]}
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground">{name}</p>
                  <p className="text-sm font-medium text-primary">{role}</p>
                  <p className="text-xs text-muted-foreground">{crm}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{bio}</p>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="size-3.5 fill-primary text-primary" aria-hidden="true" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificações */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Certificações</p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
              Um laboratório que você pode confiar
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Nosso laboratório opera com autorização da ANVISA e segue as Boas Práticas de Manipulação. Cada lote é rastreado do insumo ao produto final.
            </p>
            <ul className="flex flex-col gap-3">
              {certifications.map((cert) => (
                <li key={cert} className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-foreground">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, label: "Registro ANVISA" },
              { icon: FlaskConical, label: "Laboratório BPM" },
              { icon: PackageCheck, label: "Rastreabilidade total" },
              { icon: Users, label: "Equipe especializada" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center"
              >
                <Icon className="size-8 text-primary" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-4xl">
            Tem alguma dúvida? A gente responde.
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Nossa equipe de farmacêuticos está pronta para te ajudar a encontrar a fórmula certa.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/contato" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "gap-2")}>
              Fale conosco
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
