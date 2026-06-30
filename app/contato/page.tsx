import type { Metadata } from "next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "@/components/contact-form"
import { FaqAccordion } from "@/components/faq-accordion"
import { Phone, Mail, MessageCircle, MapPin, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contato | Farmácia do Povo",
  description: "Fale com nossa equipe de farmacêuticos. Atendimento por telefone, WhatsApp, e-mail ou formulário.",
}

const contactInfo = [
  {
    icon: Phone,
    label: "Telefone",
    value: "(11) 4002-8922",
    detail: "Seg–Sex, 8h–18h",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "(11) 99999-8922",
    detail: "Seg–Sáb, 8h–20h",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "contato@farmaciadopovo.com.br",
    detail: "Resposta em até 1 dia útil",
  },
  {
    icon: MapPin,
    label: "Endereço",
    value: "Av. Paulista, 1000",
    detail: "São Paulo – SP, 01310-100",
  },
  {
    icon: Clock,
    label: "Horário de funcionamento",
    value: "Seg–Sex: 8h às 18h",
    detail: "Sábado: 8h às 13h",
  },
]

export default function ContatoPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Header */}
      <section className="bg-primary py-12 text-primary-foreground md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
            Atendimento
          </p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-balance md:text-5xl">
            Fale com a gente
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-primary-foreground/80 md:text-lg">
            Nossa equipe de farmacêuticos está pronta para tirar dúvidas, receber receitas e ajudar você a encontrar a fórmula ideal.
          </p>
        </div>
      </section>

      {/* Formulário + Informações */}
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_360px]">

          {/* Formulário */}
          <ContactForm />

          {/* Informações de contato */}
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-xl font-bold text-foreground">Outras formas de contato</h2>
            {contactInfo.map(({ icon: Icon, label, value, detail }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="font-medium text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Perguntas frequentes
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground text-balance md:text-4xl">
              Respondemos as principais dúvidas
            </h2>
          </div>
          <FaqAccordion />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
