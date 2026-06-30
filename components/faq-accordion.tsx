"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const FAQS = [
  {
    q: "Como funciona o processo de manipulação?",
    a: "Após a confirmação do pedido, nossa equipe farmacêutica seleciona as matérias-primas com laudo de pureza, pesa as dosagens com precisão de miligrama e encapsula ou formula conforme a especificação. Todo o processo é supervisionado por farmacêutico responsável e dura em média 2 dias úteis.",
  },
  {
    q: "Preciso de receita médica para comprar?",
    a: "Depende do produto. Fórmulas com substâncias de controle especial exigem receita médica. Suplementos e vitaminas geralmente não precisam. Durante o processo de compra, informamos quando a receita é necessária e como enviá-la digitalmente.",
  },
  {
    q: "Qual é o prazo de entrega?",
    a: "O prazo médio é de 5 a 8 dias úteis a partir da confirmação do pagamento: 2 dias úteis para manipulação e 3 a 5 dias úteis para entrega via transportadora. Pedidos acima de R$199 têm frete grátis para todo o Brasil.",
  },
  {
    q: "Como posso rastrear meu pedido?",
    a: "Após o despacho, você recebe um e-mail com o código de rastreio. Também é possível acompanhar o pedido em tempo real acessando Minha conta > Meus pedidos > Rastrear pedido.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Aceitamos cartão de crédito em até 12 vezes (sem juros em até 3x), PIX com confirmação imediata e boleto bancário com prazo de 2 dias úteis para compensação.",
  },
  {
    q: "Posso personalizar a dosagem da fórmula?",
    a: "Sim! Essa é uma das principais vantagens da farmácia magistral. Com prescrição médica, podemos ajustar a dosagem de qualquer ativo de acordo com a sua necessidade individual. Entre em contato com nossa equipe para saber mais.",
  },
  {
    q: "As fórmulas têm registro na ANVISA?",
    a: "Nosso laboratório possui Autorização de Funcionamento pela ANVISA e segue as Boas Práticas de Manipulação (RDC 67/2007). As matérias-primas utilizadas possuem registro e laudo de identidade e pureza. Fórmulas magistrais são isentas de registro individual, mas são regulamentadas e controladas.",
  },
]

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-secondary"
            aria-expanded={open === i}
          >
            <span className="font-medium text-foreground">{faq.q}</span>
            <ChevronDown
              className={`size-5 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          {open === i && (
            <div className="border-t border-border bg-secondary px-6 pb-5 pt-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
