import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Termos de Uso | Farmácia do Povo",
  description: "Condições de uso do site e dos serviços da Farmácia do Povo.",
}

const sections = [
  {
    title: "1. Aceitação dos Termos",
    content: `Estes Termos de Uso ("Termos") regem o acesso e a utilização do site e dos serviços da Farmácia do Povo ("nós", "nosso" ou "Empresa"). Ao criar uma conta, navegar ou realizar uma compra, você ("Usuário" ou "Cliente") declara que leu, entendeu e concorda integralmente com estes Termos e com a nossa Política de Privacidade.

Caso não concorde com qualquer disposição, você não deve utilizar o site nem os nossos serviços.`,
  },
  {
    title: "2. Definições",
    content: `**Site:** a plataforma de e-commerce da Farmácia do Povo.
**Produtos manipulados:** fórmulas preparadas individualmente pela nossa farmácia, conforme prescrição ou padronização.
**Conta:** o cadastro pessoal do Usuário, protegido por login e senha.
**Pedido:** a solicitação de compra de um ou mais produtos realizada pelo Usuário.`,
  },
  {
    title: "3. Cadastro e conta",
    content: `Para comprar, o Usuário deve criar uma conta fornecendo dados verdadeiros, completos e atualizados. O login também pode ser feito por provedores externos (ex: Google).

O Usuário é o único responsável pela guarda e confidencialidade das suas credenciais e por todas as atividades realizadas em sua conta. Comunique-nos imediatamente qualquer uso não autorizado.

É proibido criar contas com dados falsos, de terceiros sem autorização, ou para menores de 18 anos sem representação legal.`,
  },
  {
    title: "4. Produtos, receitas e responsabilidade farmacêutica",
    content: `Os produtos manipulados são preparados por farmacêutico responsável, seguindo as boas práticas de manipulação e a regulamentação da ANVISA.

**Medicamentos que exigem prescrição só serão manipulados e entregues mediante apresentação de receita médica válida.** A Empresa pode solicitar o envio da receita e reserva-se o direito de recusar ou cancelar pedidos sem prescrição adequada, com devolução dos valores pagos.

As informações de produtos no site têm caráter informativo e não substituem a orientação de um médico ou farmacêutico. O uso de qualquer produto é de responsabilidade do Usuário, conforme orientação profissional.`,
  },
  {
    title: "5. Preços e pagamento",
    content: `Os preços exibidos estão em reais (R$) e podem ser alterados a qualquer momento, sem aviso prévio, respeitando os pedidos já confirmados.

O pagamento é processado por gateway de pagamento parceiro (Pagar.me), com as opções de cartão de crédito, PIX e boleto. A Empresa não armazena os dados completos do cartão — a transação é tokenizada e processada diretamente pelo gateway.

O pedido só é encaminhado para preparação após a confirmação do pagamento. Pedidos por PIX ou boleto não pagos dentro do prazo são automaticamente cancelados.`,
  },
  {
    title: "6. Entrega",
    content: `Os prazos e valores de frete são informados no checkout, antes da finalização da compra, e variam conforme o endereço de entrega e a disponibilidade dos insumos.

O prazo de entrega começa a contar após a confirmação do pagamento e, quando aplicável, a validação da receita. Atrasos causados pela transportadora, por indisponibilidade do destinatário ou por dados de endereço incorretos não são de responsabilidade da Empresa.`,
  },
  {
    title: "7. Trocas, devoluções e direito de arrependimento",
    content: `Nos termos do Art. 49 do Código de Defesa do Consumidor, o Cliente pode desistir da compra em até **7 (sete) dias corridos** a partir do recebimento, para compras feitas fora do estabelecimento físico.

**Importante:** por questões sanitárias, **medicamentos manipulados e produtos personalizados não podem ser devolvidos** após a abertura ou uso, salvo em caso de defeito, erro na manipulação ou avaria no transporte. Nesses casos, entre em contato em até 7 dias do recebimento para troca ou reembolso.

Reembolsos são feitos pelo mesmo meio de pagamento utilizado na compra, nos prazos da instituição financeira.`,
  },
  {
    title: "8. Responsabilidades do Usuário",
    content: `O Usuário compromete-se a:

— Fornecer informações verídicas e manter seus dados atualizados.
— Utilizar o site de forma lícita, sem praticar fraudes ou violar direitos de terceiros.
— Não tentar acessar áreas restritas, sistemas ou dados de outros usuários.
— Apresentar receitas válidas e autênticas quando exigido.
— Utilizar os produtos conforme orientação médica e farmacêutica.`,
  },
  {
    title: "9. Propriedade intelectual",
    content: `Todo o conteúdo do site — marca, logotipo, textos, imagens, layout e código — é de propriedade da Farmácia do Povo ou licenciado a ela, protegido pela legislação de propriedade intelectual.

É vedada a reprodução, distribuição ou uso comercial sem autorização prévia e por escrito da Empresa.`,
  },
  {
    title: "10. Limitação de responsabilidade",
    content: `A Empresa envida seus melhores esforços para manter o site disponível e as informações corretas, mas não garante funcionamento ininterrupto ou livre de erros.

A Empresa não se responsabiliza por danos decorrentes de: uso indevido dos produtos sem orientação profissional; indisponibilidade temporária do site; ou falhas de terceiros (transportadoras, gateway de pagamento, provedores de internet).`,
  },
  {
    title: "11. Privacidade e proteção de dados",
    content: `O tratamento dos seus dados pessoais é regido pela nossa Política de Privacidade, em conformidade com a LGPD (Lei nº 13.709/2018). Ao aceitar estes Termos, você declara ciência das práticas descritas naquela política.`,
  },
  {
    title: "12. Alterações dos Termos",
    content: `Estes Termos podem ser atualizados a qualquer momento para refletir mudanças legais, regulatórias ou de negócio. A versão vigente estará sempre disponível nesta página, com a data da última atualização. O uso continuado do site após alterações representa a concordância com os novos Termos.

**Última atualização:** Julho de 2026.`,
  },
  {
    title: "13. Legislação aplicável e foro",
    content: `Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro do domicílio do Consumidor para dirimir eventuais controvérsias, conforme o Código de Defesa do Consumidor.`,
  },
]

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-primary py-12 text-primary-foreground md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
            Institucional
          </p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
            Termos de Uso
          </h1>
          <p className="mt-3 text-primary-foreground/80">
            Condições de uso do site e dos serviços · Última atualização: Julho de 2026
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Ao usar a Farmácia do Povo, você concorda com estes Termos e com a nossa{" "}
          <Link href="/politica-de-privacidade" className="font-medium text-primary hover:underline">
            Política de Privacidade
          </Link>
          . Em caso de dúvida,{" "}
          <Link href="/contato" className="font-medium text-primary hover:underline">
            entre em contato
          </Link>
          .
        </div>

        <div className="flex flex-col gap-10">
          {sections.map(({ title, content }) => (
            <section key={title}>
              <h2 className="mb-4 font-heading text-xl font-bold text-foreground">{title}</h2>
              <div className="space-y-3 text-muted-foreground">
                {content.split("\n\n").map((paragraph, i) => {
                  const formatted = paragraph
                    .split(/(\*\*[^*]+\*\*)/)
                    .map((part, j) =>
                      part.startsWith("**") && part.endsWith("**")
                        ? <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
                        : part
                    )
                  return (
                    <p key={i} className="leading-relaxed">
                      {formatted}
                    </p>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Dúvidas sobre estes Termos?{" "}
            <Link href="/contato" className="font-semibold text-primary hover:underline">
              Fale conosco
            </Link>
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  )
}
