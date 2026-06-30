import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaNewsletter() {
  return (
    <section className="bg-background pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground md:px-12 md:py-16">
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Ganhe 10% off na primeira compra
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed text-primary-foreground/80">
            Cadastre seu e-mail e receba ofertas exclusivas, novidades e dicas de
            saúde dos nossos farmacêuticos.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="Seu melhor e-mail"
              aria-label="Seu e-mail"
              className="h-12 w-full rounded-full bg-card px-5 text-sm text-foreground outline-none ring-card focus-visible:ring-2"
            />
            <Button
              type="submit"
              size="lg"
              variant="secondary"
              className="gap-2 rounded-full"
            >
              Quero meu desconto
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
