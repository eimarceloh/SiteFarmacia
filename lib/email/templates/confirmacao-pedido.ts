export type ItemEmail = {
  name: string
  quantity: number
  price: number
  image?: string
}

export type EnderecoEmail = {
  logradouro: string
  numero: string
  complemento?: string | null
  bairro: string
  cidade: string
  estado: string
  cep: string
}

export type ConfirmacaoPedidoInput = {
  to: string
  nome: string
  numeroPedido: string
  items: ItemEmail[]
  subtotal: number
  frete: number
  total: number
  enderecoEntrega: EnderecoEmail
  formaPagamento: string
}

function brl(value: number) {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function labelPagamento(forma: string) {
  if (forma === "pix") return "PIX"
  if (forma === "cartao") return "Cartão de crédito"
  return forma
}

export function gerarHtmlConfirmacaoPedido(data: ConfirmacaoPedidoInput): string {
  const { nome, numeroPedido, items, subtotal, frete, total, enderecoEntrega, formaPagamento } = data
  const primeiroNome = nome.split(" ")[0]

  const linhasItens = items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;">
          ${item.name}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;text-align:center;">
          ${item.quantity}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;text-align:right;white-space:nowrap;">
          R$ ${brl(item.price * item.quantity)}
        </td>
      </tr>`,
    )
    .join("")

  const endereco = [
    `${enderecoEntrega.logradouro}, ${enderecoEntrega.numero}`,
    enderecoEntrega.complemento || "",
    enderecoEntrega.bairro,
    `${enderecoEntrega.cidade} - ${enderecoEntrega.estado}`,
    `CEP ${enderecoEntrega.cep}`,
  ]
    .filter(Boolean)
    .join("<br>")

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pedido ${numeroPedido} confirmado</title>
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
              <h1 style="margin:8px 0 0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">
                Pedido confirmado!
              </h1>
              <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">
                Seu pedido foi recebido e está sendo processado.
              </p>
            </td>
          </tr>

          <!-- Número do pedido -->
          <tr>
            <td style="padding:24px 40px;background:#fafafa;border-bottom:1px solid #f0f0f0;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:1.5px;color:#999;text-transform:uppercase;">Número do pedido</p>
              <p style="margin:0;font-size:28px;font-weight:800;color:#B73336;letter-spacing:1px;">${numeroPedido}</p>
            </td>
          </tr>

          <!-- Saudação -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;font-size:16px;color:#333;">
                Olá, <strong>${primeiroNome}</strong>! Obrigado pela sua compra.
                Nossa equipe farmacêutica já foi notificada e em breve iniciará a manipulação das suas fórmulas.
              </p>
            </td>
          </tr>

          <!-- Itens do pedido -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:0.5px;">Itens do pedido</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr>
                    <th style="font-size:12px;font-weight:600;color:#999;text-align:left;padding-bottom:8px;border-bottom:2px solid #f0f0f0;text-transform:uppercase;letter-spacing:0.5px;">Produto</th>
                    <th style="font-size:12px;font-weight:600;color:#999;text-align:center;padding-bottom:8px;border-bottom:2px solid #f0f0f0;text-transform:uppercase;letter-spacing:0.5px;">Qtd</th>
                    <th style="font-size:12px;font-weight:600;color:#999;text-align:right;padding-bottom:8px;border-bottom:2px solid #f0f0f0;text-transform:uppercase;letter-spacing:0.5px;">Total</th>
                  </tr>
                </thead>
                <tbody>${linhasItens}</tbody>
              </table>
            </td>
          </tr>

          <!-- Totais -->
          <tr>
            <td style="padding:16px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:13px;color:#666;padding:4px 0;">Subtotal</td>
                  <td style="font-size:13px;color:#333;text-align:right;padding:4px 0;">R$ ${brl(subtotal)}</td>
                </tr>
                <tr>
                  <td style="font-size:13px;color:#666;padding:4px 0;">Frete</td>
                  <td style="font-size:13px;color:#333;text-align:right;padding:4px 0;">${frete === 0 ? "Grátis" : `R$ ${brl(frete)}`}</td>
                </tr>
                <tr>
                  <td style="height:1px;background:#f0f0f0;" colspan="2"></td>
                </tr>
                <tr>
                  <td style="font-size:16px;font-weight:800;color:#111;padding:10px 0 0;">Total</td>
                  <td style="font-size:16px;font-weight:800;color:#B73336;text-align:right;padding:10px 0 0;">R$ ${brl(total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divisor -->
          <tr>
            <td style="padding:24px 40px 0;">
              <hr style="border:none;border-top:1px solid #f0f0f0;margin:0;" />
            </td>
          </tr>

          <!-- Endereço e pagamento -->
          <tr>
            <td style="padding:24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" valign="top" style="padding-right:16px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Endereço de entrega</p>
                    <p style="margin:0;font-size:13px;color:#333;line-height:1.7;">${endereco}</p>
                  </td>
                  <td width="50%" valign="top">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.5px;">Forma de pagamento</p>
                    <p style="margin:0;font-size:13px;color:#333;">${labelPagamento(formaPagamento)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Próximos passos -->
          <tr>
            <td style="padding:0 40px 32px;">
              <div style="background:#fef9e7;border:1px solid #fde68a;border-radius:8px;padding:16px;">
                <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#92400e;">O que acontece agora?</p>
                <p style="margin:0;font-size:13px;color:#78350f;line-height:1.6;">
                  Nossa equipe irá manipular suas fórmulas e você receberá atualizações de status por e-mail.
                  O prazo de entrega começa a contar após a confirmação do pagamento.
                </p>
              </div>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="background:#fafafa;border-top:1px solid #f0f0f0;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:#666;">
                Dúvidas? Entre em contato conosco.
              </p>
              <p style="margin:0;font-size:12px;color:#aaa;">
                © ${new Date().getFullYear()} Farmácia do Povo. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function gerarTextoConfirmacaoPedido(data: ConfirmacaoPedidoInput): string {
  const { nome, numeroPedido, items, subtotal, frete, total } = data
  const linhas = items.map((i) => `- ${i.name} x${i.quantity}: R$ ${brl(i.price * i.quantity)}`).join("\n")
  return `Olá, ${nome}!

Seu pedido ${numeroPedido} foi confirmado.

ITENS:
${linhas}

Subtotal: R$ ${brl(subtotal)}
Frete: ${frete === 0 ? "Grátis" : `R$ ${brl(frete)}`}
Total: R$ ${brl(total)}

Obrigado por comprar na Farmácia do Povo!`
}
