import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Política de Privacidade | Farmácia do Povo",
  description: "Saiba como a Farmácia do Povo coleta, usa e protege seus dados pessoais conforme a LGPD.",
}

const sections = [
  {
    title: "1. Introdução",
    content: `A Farmácia do Povo ("nós", "nosso" ou "Empresa") valoriza a privacidade dos seus clientes e está comprometida em proteger seus dados pessoais. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e compartilhamos suas informações ao utilizar nosso site e serviços, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).

Ao utilizar nossos serviços, você concorda com os termos desta política. Caso não concorde, recomendamos que não utilize nosso site.`,
  },
  {
    title: "2. Dados pessoais que coletamos",
    content: `Podemos coletar as seguintes categorias de dados pessoais:

**Dados de identificação:** nome completo, CPF, data de nascimento.

**Dados de contato:** endereço de e-mail, telefone, endereço de entrega (CEP, logradouro, número, complemento, bairro, cidade, estado).

**Dados de saúde:** receitas médicas e informações de saúde fornecidas voluntariamente para a manipulação de fórmulas. Esses dados são tratados com proteção adicional conforme o Art. 11 da LGPD.

**Dados de pagamento:** informações de cartão de crédito (processadas diretamente pelo gateway de pagamento, não armazenadas por nós), comprovantes de PIX.

**Dados de navegação:** endereço IP, tipo de navegador, páginas visitadas, tempo de sessão, cookies e tecnologias similares.`,
  },
  {
    title: "3. Como utilizamos seus dados",
    content: `Utilizamos seus dados pessoais para as seguintes finalidades:

— Processar e entregar seus pedidos de produtos manipulados.
— Enviar comunicações transacionais (confirmação de pedido, nota fiscal, rastreio de entrega).
— Gerenciar sua conta e histórico de pedidos.
— Cumprir obrigações legais e regulatórias (ANVISA, Receita Federal, CRF).
— Melhorar nossos produtos e a experiência no site.
— Enviar comunicações de marketing, quando você optou por recebê-las (opt-in).
— Prevenir fraudes e garantir a segurança das transações.

A base legal para o tratamento é, conforme o caso: execução de contrato (Art. 7º, V), cumprimento de obrigação legal (Art. 7º, II), legítimo interesse (Art. 7º, IX) e, para dados sensíveis de saúde, o consentimento explícito (Art. 11, I).`,
  },
  {
    title: "4. Compartilhamento de dados",
    content: `Seus dados pessoais podem ser compartilhados com:

**Transportadoras e Correios:** para fins de entrega do pedido.
**Gateway de pagamento:** para processamento seguro das transações financeiras.
**Farmacêuticos responsáveis:** para a manipulação adequada das fórmulas.
**Autoridades públicas:** quando exigido por lei, ordem judicial ou regulação da ANVISA e CRF.
**Prestadores de serviços tecnológicos:** hospedagem, e-mail transacional, analytics — sempre sob cláusulas de confidencialidade.

Não vendemos, alugamos nem comercializamos seus dados pessoais com terceiros para fins publicitários.`,
  },
  {
    title: "5. Cookies e tecnologias de rastreamento",
    content: `Utilizamos cookies e tecnologias similares para:

— Manter sua sessão ativa e o carrinho de compras.
— Lembrar suas preferências de navegação.
— Analisar o comportamento de uso do site (Google Analytics ou similar).
— Exibir anúncios relevantes em plataformas parceiras.

Você pode gerenciar ou desativar cookies nas configurações do seu navegador. A desativação de cookies essenciais pode impactar o funcionamento do site.`,
  },
  {
    title: "6. Segurança dos dados",
    content: `Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição, incluindo:

— Criptografia SSL/TLS em todas as páginas do site.
— Controle de acesso com autenticação aos sistemas internos.
— Armazenamento em servidores com proteção física e lógica.
— Revisões periódicas de segurança.

Em caso de incidente de segurança que possa afetar seus dados, notificaremos a ANPD e os titulares afetados conforme os prazos previstos na LGPD.`,
  },
  {
    title: "7. Seus direitos como titular (LGPD)",
    content: `Conforme a LGPD, você tem direito a:

— **Confirmação e acesso:** saber se tratamos seus dados e obter uma cópia.
— **Correção:** solicitar a correção de dados incompletos, inexatos ou desatualizados.
— **Anonimização, bloqueio ou eliminação:** de dados desnecessários ou tratados em desconformidade com a lei.
— **Portabilidade:** receber seus dados em formato estruturado para transferência a outro fornecedor.
— **Eliminação:** solicitar a exclusão dos dados tratados com base em consentimento.
— **Informação sobre compartilhamento:** saber com quais entidades seus dados foram compartilhados.
— **Revogação do consentimento:** a qualquer momento, para os tratamentos baseados em consentimento.
— **Oposição:** ao tratamento realizado com base em legítimo interesse.

Para exercer qualquer direito, entre em contato pelo e-mail: **privacidade@farmaciadopovo.com.br**`,
  },
  {
    title: "8. Retenção de dados",
    content: `Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades para as quais foram coletados ou conforme exigido por obrigações legais:

— Dados de pedidos e receitas médicas: mínimo de 5 anos (obrigação regulatória ANVISA/CRF).
— Dados de conta: enquanto a conta estiver ativa ou conforme solicitado pelo titular.
— Dados de navegação e cookies: conforme os períodos definidos em cada ferramenta de analytics.

Após o período de retenção, os dados são eliminados de forma segura ou anonimizados.`,
  },
  {
    title: "9. Encarregado de Proteção de Dados (DPO)",
    content: `Nosso Encarregado de Proteção de Dados pode ser contactado para dúvidas, solicitações e exercício de direitos:

**E-mail:** privacidade@farmaciadopovo.com.br
**Endereço:** Av. Paulista, 1000, São Paulo – SP, CEP 01310-100
**Prazo de resposta:** até 15 dias úteis.`,
  },
  {
    title: "10. Atualizações desta política",
    content: `Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na legislação aplicável. Notificaremos alterações relevantes por e-mail ou por aviso destacado no site. A data da última atualização está indicada abaixo.

**Última atualização:** Junho de 2026.`,
  },
]

export default function PoliticaPrivacidadePage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="bg-primary py-12 text-primary-foreground md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">
            Institucional
          </p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-5xl">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-primary-foreground/80">
            Conformidade com a LGPD (Lei nº 13.709/2018) · Última atualização: Junho de 2026
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          Esta página explica como a Farmácia do Povo trata seus dados pessoais. Navegue pelas seções ou{" "}
          <Link href="/contato" className="font-medium text-primary hover:underline">
            entre em contato
          </Link>{" "}
          caso tenha dúvidas.
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
            Dúvidas sobre esta política?{" "}
            <Link href="/contato" className="font-semibold text-primary hover:underline">
              Fale conosco
            </Link>
            {" "}ou envie um e-mail para{" "}
            <a href="mailto:privacidade@farmaciadopovo.com.br" className="font-semibold text-primary hover:underline">
              privacidade@farmaciadopovo.com.br
            </a>
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  )
}
