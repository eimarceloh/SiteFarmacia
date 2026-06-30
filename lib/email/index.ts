import { Resend } from "resend"
import {
  gerarHtmlConfirmacaoPedido,
  gerarTextoConfirmacaoPedido,
  type ConfirmacaoPedidoInput,
} from "./templates/confirmacao-pedido"
import {
  gerarHtmlConfirmacaoConta,
  gerarTextoConfirmacaoConta,
  type ConfirmacaoContaInput,
} from "./templates/confirmacao-conta"
import {
  gerarHtmlBoasVindas,
  gerarTextoBoasVindas,
  type BoasVindasInput,
} from "./templates/boas-vindas"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM ?? "Farmácia do Povo <onboarding@resend.dev>"

export async function sendOrderConfirmation(data: ConfirmacaoPedidoInput) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [data.to],
    subject: `Pedido ${data.numeroPedido} confirmado — Farmácia do Povo`,
    html: gerarHtmlConfirmacaoPedido(data),
    text: gerarTextoConfirmacaoPedido(data),
  })
  if (error) console.error("[Resend] Erro ao enviar e-mail de pedido:", error)
}

export async function sendAccountConfirmation(data: ConfirmacaoContaInput) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [data.to],
    subject: "Confirme seu e-mail — Farmácia do Povo",
    html: gerarHtmlConfirmacaoConta(data),
    text: gerarTextoConfirmacaoConta(data),
  })
  if (error) console.error("[Resend] Erro ao enviar e-mail de confirmação de conta:", error)
}

export async function sendWelcomeEmail(data: BoasVindasInput) {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [data.to],
    subject: "Bem-vindo(a) à Farmácia do Povo!",
    html: gerarHtmlBoasVindas(data),
    text: gerarTextoBoasVindas(data),
  })
  if (error) console.error("[Resend] Erro ao enviar e-mail de boas-vindas:", error)
}
