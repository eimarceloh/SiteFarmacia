import { Button } from "@/components/ui/button"
import { ArrowRight, Gift } from "lucide-react"

export function CtaNewsletter() {
  return (
    <section className="bg-muted pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 md:px-14 md:py-16">

          {/* Elemento decorativo de fundo */}
          <div
            className="absolute -right-16 -top-16 size-64 rounded-full bg-white/5"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-10 -left-10 size-48 rounded-full bg-white/5"
            aria-hidden="true"
          />

          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex flex-col gap-4">
              {/* Badge */}
              <div className="flex items-center gap-2 self-start rounded-full bg-white/15 px-4 py-1.5">
                <Gift className="size-4 text-white" aria-hidden="true" />
                <span className="text-sm font-semibold text-white">Oferta de boas-vindas</span>
              </div>

              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white text-balance md:text-4xl">
                10% off na sua <span className="underline decoration-white/40 underline-offset-4">primeira compra</span>
              </h2>
              <p className="max-w-lg text-pretty leading-relaxed text-white/80">
                Cadastre seu e-mail e receba o cupom na hora, além de dicas
                exclusivas de saúde dos nossos farmacêuticos e ofertas antes de
                todo mundo.
              </p>
            </div>

            {/* Formulário */}
            <form
              className="flex w-full min-w-0 flex-col gap-3 md:w-80"
              aria-label="Formulário de newsletter"
            >
              <input
                type="email"
                required
                placeholder="Seu melhor e-mail"
                aria-label="Seu e-mail"
                className="h-12 w-full rounded-full bg-white/95 px-5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-white"
              />
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90"
              >
                Quero meu desconto
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <p className="text-center text-xs text-white/60">
                Sem spam. Cancele quando quiser.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
