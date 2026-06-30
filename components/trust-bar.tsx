import { Truck, ShieldCheck, CreditCard, Headset, FlaskConical } from "lucide-react"

const items = [
  { icon: FlaskConical, title: "Manipulado sob medida", desc: "Pronto em até 2 dias úteis" },
  { icon: Truck, title: "Frete grátis", desc: "Acima de R$ 199" },
  { icon: ShieldCheck, title: "Qualidade garantida", desc: "Registro ANVISA" },
  { icon: CreditCard, title: "Parcele em 12x", desc: "Sem juros no cartão" },
  { icon: Headset, title: "Atendimento", desc: "Farmacêutico online" },
]

export function TrustBar() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-5">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
