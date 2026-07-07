export type VarianteAtualizacao = "aprovado" | "enviado"

export type AtualizacaoPedidoInput = {
  to: string
  nome: string
  numeroPedido: string
  variante: VarianteAtualizacao
  urlAcompanhamento?: string
  codigoRastreio?: string | null
}

const CONTEUDO: Record<VarianteAtualizacao, {
  titulo: string
  subtitulo: string
  corpo: string
  destaqueTitulo: string
  destaqueTexto: string
}> = {
  aprovado: {
    titulo: "Pedido aprovado!",
    subtitulo: "Seu pedido foi aprovado e entrou em preparação.",
    corpo:
      "Boas notícias! Seu pedido foi aprovado e nossa equipe farmacêutica já iniciou a manipulação das suas fórmulas com todo o cuidado.",
    destaqueTitulo: "O que acontece agora?",
    destaqueTexto:
      "Assim que suas fórmulas estiverem prontas e o pedido for despachado, você receberá um novo e-mail avisando.",
  },
  enviado: {
    titulo: "Seu pedido foi enviado!",
    subtitulo: "Seu pedido saiu da nossa farmácia e está a caminho.",
    corpo:
      "Tudo pronto! Suas fórmulas foram manipuladas, embaladas e o seu pedido já foi despachado. Em breve ele chegará até você.",
    destaqueTitulo: "Acompanhe a entrega",
    destaqueTexto:
      "Você pode acompanhar o status do seu pedido a qualquer momento na sua conta.",
  },
}

export function gerarHtmlAtualizacaoPedido(data: AtualizacaoPedidoInput): string {
  const { nome, numeroPedido, variante, urlAcompanhamento, codigoRastreio } = data
  const primeiroNome = nome.split(" ")[0]
  const c = CONTEUDO[variante]

  const botao = urlAcompanhamento
    ? `<tr>
        <td style="padding:8px 40px 0;text-align:center;">
          <a href="${urlAcompanhamento}" style="display:inline-block;background:#B73336;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;">
            Acompanhar meu pedido
          </a>
        </td>
      </tr>`
    : ""

  const rastreio = codigoRastreio
    ? `<tr>
        <td style="padding:16px 40px 0;">
          <div style="background:#f0f7ff;border:1px solid #cfe3fb;border-radius:8px;padding:16px;text-align:center;">
            <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:0.5px;">Código de rastreio</p>
            <p style="margin:0;font-size:18px;font-weight:800;color:#1e3a8a;letter-spacing:1px;">${codigoRastreio}</p>
          </div>
        </td>
      </tr>`
    : ""

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${c.titulo}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Cabeçalho -->
          <tr>
            <td style="background:#B73336;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;">Farmácia do Povo</p>
              <h1 style="margin:8px 0 0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">${c.titulo}</h1>
              <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">${c.subtitulo}</p>
            </td>
          </tr>

          <!-- Número do pedido -->
          <tr>
            <td style="padding:24px 40px;background:#fafafa;border-bottom:1px solid #f0f0f0;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:1.5px;color:#999;text-transform:uppercase;">Número do pedido</p>
              <p style="margin:0;font-size:28px;font-weight:800;color:#B73336;letter-spacing:1px;">${numeroPedido}</p>
            </td>
          </tr>

          <!-- Saudação / corpo -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;font-size:16px;color:#333;line-height:1.6;">
                Olá, <strong>${primeiroNome}</strong>! ${c.corpo}
              </p>
            </td>
          </tr>

          ${rastreio}
          ${botao}

          <!-- Destaque -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <div style="background:#fef9e7;border:1px solid #fde68a;border-radius:8px;padding:16px;">
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#92400e;">${c.destaqueTitulo}</p>
                <p style="margin:0;font-size:13px;color:#78350f;line-height:1.6;">${c.destaqueTexto}</p>
              </div>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #f0f0f0;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:#666;">Dúvidas? Entre em contato conosco.</p>
              <p style="margin:0;font-size:12px;color:#aaa;">© ${new Date().getFullYear()} Farmácia do Povo. Todos os direitos reservados.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function gerarTextoAtualizacaoPedido(data: AtualizacaoPedidoInput): string {
  const { nome, numeroPedido, variante, urlAcompanhamento, codigoRastreio } = data
  const c = CONTEUDO[variante]
  return `Olá, ${nome}!

${c.corpo}

Pedido: ${numeroPedido}${codigoRastreio ? `\nCódigo de rastreio: ${codigoRastreio}` : ""}${urlAcompanhamento ? `\n\nAcompanhe: ${urlAcompanhamento}` : ""}

Farmácia do Povo`
}
