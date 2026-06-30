export type ConfirmacaoContaInput = {
  to: string
  nome: string
  confirmationUrl: string
}

export function gerarHtmlConfirmacaoConta({ nome, confirmationUrl }: ConfirmacaoContaInput): string {
  const primeiroNome = nome?.split(" ")[0] || "Cliente"

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirme seu e-mail — Farmácia do Povo</title>
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
                Confirme seu e-mail
              </h1>
              <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">
                Só mais um passo para ativar sua conta.
              </p>
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td style="padding:40px 40px 0;">
              <p style="margin:0 0 16px;font-size:16px;color:#333;line-height:1.6;">
                Olá, <strong>${primeiroNome}</strong>!
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.7;">
                Recebemos o seu cadastro na <strong>Farmácia do Povo</strong>.
                Para ativar sua conta e começar a acompanhar seus pedidos, clique no botão abaixo:
              </p>

              <!-- Botão CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${confirmationUrl}"
                       style="display:inline-block;background:#B73336;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 40px;border-radius:8px;letter-spacing:0.3px;">
                      Confirmar minha conta
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Aviso de expiração -->
              <div style="background:#fef9e7;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                  <strong>Este link expira em 24 horas.</strong>
                  Se você não criou uma conta na Farmácia do Povo, pode ignorar este e-mail com segurança.
                </p>
              </div>

              <!-- Link de texto como fallback -->
              <p style="font-size:12px;color:#999;line-height:1.6;margin:0 0 8px;">
                Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
              </p>
              <p style="font-size:12px;color:#B73336;word-break:break-all;margin:0 0 32px;">
                ${confirmationUrl}
              </p>
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

export function gerarTextoConfirmacaoConta({ nome, confirmationUrl }: ConfirmacaoContaInput): string {
  const primeiroNome = nome?.split(" ")[0] || "Cliente"
  return `Olá, ${primeiroNome}!

Confirme sua conta na Farmácia do Povo clicando no link abaixo:

${confirmationUrl}

Este link expira em 24 horas.

Se você não criou uma conta, ignore este e-mail.

— Farmácia do Povo`
}
