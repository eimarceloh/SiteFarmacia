# Pagamentos com Pagar.me (cartão, PIX e boleto)

A integração já está no código. Para funcionar, você precisa **criar a conta**,
pegar as **chaves de teste** e configurar as variáveis de ambiente + o webhook.
Enquanto as chaves não existirem, o checkout continua funcionando no modo antigo
(cria o pedido como `pendente`, sem cobrança).

## 1. Criar a conta e ativar o modo teste

1. Acesse [pagar.me](https://pagar.me/) → **Criar conta** (dá para começar sem
   CNPJ aprovado, usando o ambiente de teste).
2. No painel (dashboard.pagar.me), procure o seletor **Live / Test** e mude para
   **Test** (ambiente sandbox — nenhuma cobrança real acontece).

## 2. Pegar as chaves de teste

No painel, em **Configurações → Chaves** (ou *Settings → API Keys*), copie:

- **Secret Key** de teste → começa com `sk_test_...`
- **Public Key** de teste → começa com `pk_test_...`

## 3. Configurar as variáveis de ambiente

No `.env.local` (e depois na **Vercel → Settings → Environment Variables**):

```bash
PAGARME_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_PAGARME_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
# Opcional — segredo do webhook (Basic auth), veja passo 5
PAGARME_WEBHOOK_SECRET=um-segredo-forte-qualquer
```

> `PAGARME_SECRET_KEY` é usada só no servidor. A `NEXT_PUBLIC_PAGARME_PUBLIC_KEY`
> vai ao navegador (é isso que tokeniza o cartão sem o número passar pelo nosso
> backend).

Depois de configurar, rode a migração **007_pagamentos_pagarme.sql** no Supabase.

## 4. Cartões de teste (sandbox)

No ambiente de teste, use cartões fictícios. Exemplos comuns do Pagar.me:

| Cartão | Resultado |
|--------|-----------|
| `4000 0000 0000 0010` | Autorizado ✅ |
| `4000 0000 0000 0002` | Recusado ❌ |

- Validade: qualquer data futura (ex: `12/30`)
- CVV: qualquer (ex: `123`)
- Confira a lista oficial atualizada em
  [docs.pagar.me](https://docs.pagar.me/docs/cartões-de-teste).

**PIX/boleto no teste:** o QR e o boleto são fictícios. Você confirma o
"pagamento" manualmente pelo painel (na tela do pedido de teste) — aí o webhook
dispara e o pedido vira `pago`.

## 5. Webhook (confirmação de PIX/boleto)

PIX e boleto são assíncronos: o cliente paga depois. O Pagar.me avisa nosso
sistema por webhook.

1. Painel Pagar.me → **Configurações → Webhooks → Adicionar**.
2. URL: `https://site-farmacia-eight.vercel.app/api/webhooks/pagarme`
3. Eventos: marque pelo menos `order.paid`, `charge.paid`,
   `charge.payment_failed`, `charge.refunded`.
4. Se o painel permitir Basic Auth, use o mesmo valor de `PAGARME_WEBHOOK_SECRET`.

## Como o fluxo funciona no código

- **Cartão:** o navegador tokeniza (`lib/pagarme/tokenize.ts`) → manda só o
  `card_token` para `/api/pedidos` → o servidor cobra (`lib/pagarme/orders.ts`).
  Aprovou → pedido `pago`; recusou → erro, sem criar pedido.
- **PIX/boleto:** `/api/pedidos` cria o pedido `pendente` + gera QR/boleto e
  devolve para a tela mostrar. O `/api/webhooks/pagarme` marca `pago` quando o
  cliente paga.
- Sem `PAGARME_SECRET_KEY`, tudo cai no modo antigo (pedido `pendente`), sem quebrar.
