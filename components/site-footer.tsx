import Link from "next/link"
import { AtSign, MessageCircle, Mail, Phone } from "lucide-react"
import { LogoIcon } from "@/components/logo"

const columns = [
  {
    title: "Categorias",
    links: [
      { label: "Emagrecimento", href: "/categoria/emagrecimento" },
      { label: "Desempenho",    href: "/categoria/desempenho" },
      { label: "Saúde",         href: "/categoria/saude" },
      { label: "Queda Capilar", href: "/categoria/queda-capilar" },
      { label: "Beleza",        href: "/categoria/beleza" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { label: "Sobre nós",              href: "/sobre" },
      { label: "Nosso laboratório",      href: "/sobre#certificacoes" },
      { label: "Política de privacidade", href: "/politica-de-privacidade" },
      { label: "Trocas e devoluções",    href: "/contato" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Como comprar",   href: "/produtos" },
      { label: "Enviar receita", href: "/contato" },
      { label: "Rastrear pedido", href: "/conta" },
      { label: "Fale conosco",   href: "/contato" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <LogoIcon className="size-10 shrink-0" />
            <span className="font-heading text-lg font-extrabold leading-tight tracking-tight text-foreground">
              Farmácia do Pov<span className="text-brand-red">+</span>
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Farmácia do povo, para o povo. Fórmulas sob medida com qualidade
            farmacêutica e entrega para todo o Brasil.
          </p>
          <div className="flex gap-2">
            <a href="#" aria-label="Instagram" className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
              <AtSign className="size-5" aria-hidden="true" />
            </a>
            <a href="#" aria-label="WhatsApp" className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
              <MessageCircle className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              {col.title}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {col.links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <span className="flex items-center gap-2">
              <Phone className="size-4" aria-hidden="true" /> (11) 4002-8922
            </span>
            <span className="flex items-center gap-2">
              <Mail className="size-4" aria-hidden="true" /> contato@farmaciadopovo.com.br
            </span>
          </div>
          <p>© {new Date().getFullYear()} Farmácia do Povo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
