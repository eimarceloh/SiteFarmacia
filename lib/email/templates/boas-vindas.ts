export type BoasVindasInput = {
  to: string
  nome: string
}

export function gerarHtmlBoasVindas({ nome }: BoasVindasInput): string {
  const primeiroNome = nome?.split(" ")[0] || "Cliente"

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bem-vindo à Farmácia do Povo</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <!-- Cabeçalho com ilustração -->
          <tr>
            <td style="background:linear-gradient(135deg,#B73336 0%,#8f1f22 100%);padding:40px 40px 32px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;margin-bottom:16px;">
                ✅
              </div>
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,0.75);text-transform:uppercase;">Farmácia do Povo</p>
              <h1 style="margin:8px 0 0;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">
                Conta confirmada!
              </h1>
              <p style="margin:8px 0 0;font-size:15px;color:rgba(255,255,255,0.9);">
                Bem-vindo(a) à família Farmácia do Povo 🎉
              </p>
            </td>
          </tr>

          <!-- Saudação -->
          <tr>
            <td style="padding:36px 40px 0;">
              <p style="margin:0 0 16px;font-size:16px;color:#333;line-height:1.6;">
                Olá, <strong>${primeiroNome}</strong>!
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.7;">
                Sua conta foi confirmada com sucesso. Agora você pode aproveitar todos os benefícios:
              </p>
            </td>
          </tr>

          <!-- Benefícios -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  ["📦", "Acompanhe seus pedidos em tempo real"],
                  ["💊", "Fórmulas manipuladas sob medida com qualidade ANVISA"],
                  ["🚀", "Checkout mais rápido com seus dados salvos"],
                  ["🔔", "Notificações de status de entrega por e-mail"],
                ]
                  .map(
                    ([icon, text]) => `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f5f5f5;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;font-size:20px;vertical-align:middle;">${icon}</td>
                        <td style="font-size:14px;color:#444;vertical-align:middle;padding-left:8px;">${text}</td>
                      </tr>
                    </table>
                  </td>
                </tr>`,
                  )
                  .join("")}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://farmaciadopovo.com.br"}"
                       style="display:inline-block;background:#B73336;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:8px;">
                      Ir para a loja
                    </a>
                  </td>
                </tr>
              </table>
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

export function gerarTextoBoasVindas({ nome }: BoasVindasInput): string {
  const primeiroNome = nome?.split(" ")[0] || "Cliente"
  return `Olá, ${primeiroNome}!

Sua conta na Farmácia do Povo foi confirmada com sucesso.

Agora você pode acompanhar seus pedidos, aproveitar o checkout mais rápido e receber notificações de entrega.

Acesse nossa loja: ${process.env.NEXT_PUBLIC_APP_URL || "https://farmaciadopovo.com.br"}

— Farmácia do Povo`
}
