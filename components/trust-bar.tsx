import { Truck, ShieldCheck, CreditCard, Headset, FlaskConical } from "lucide-react"

const items = [
  { icon: FlaskConical, title: "Manipulado sob medida",  desc: "Pronto em até 2 dias úteis" },
  { icon: Truck,        title: "Frete grátis",           desc: "Acima de R$ 199" },
  { icon: ShieldCheck,  title: "Qualidade garantida",    desc: "Registro ANVISA" },
  { icon: CreditCard,   title: "Parcele em 12x",         desc: "Sem juros no cartão" },
  { icon: Headset,      title: "Atendimento",            desc: "Farmacêutico online" },
]

export function TrustBar() {
  return (
    <section className="border-y border-border bg-background" aria-label="Diferenciais">
      <div className="mx-auto max-w-6xl px-4 py-5">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-5">
          {items.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-center gap-3">
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <Icon className="size-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
