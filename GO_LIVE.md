# Checklist de Go-Live — Farmácia do Povo

Guia para colocar o site em produção. Está dividido em **configuração** (o que
ligar/pagar), **o que falta construir** (código) e **legal/QA**. Siga na ordem.

Legenda de prioridade: **P0** = bloqueia o lançamento · **P1** = importante ·
**P2** = desejável.

---

## PARTE 1 — Configuração & Infra (ordem recomendada)

### 1. Domínio  · **P0** · ~R$ 40/ano
- [ ] Comprar o domínio (ex: `farmaciadopovo.com.br`) no [Registro.br](https://registro.br)
- [ ] Deixar o acesso ao painel de DNS à mão (vai ser usado por Vercel e Resend)

### 2. Vercel  · **P0** · US$ 20/mês (Pro — uso comercial exige)
- [ ] Assinar o plano **Pro** (o Hobby é só para uso não comercial)
- [ ] **Settings → Domains**: adicionar o domínio e apontar o DNS conforme instruções
- [ ] **Settings → Environment Variables**: cadastrar TODAS as variáveis (ver Parte 4)
- [ ] Confirmar que o deploy do `main` está verde

### 3. Supabase  · **P0** (Free) / recomendado Pro US$ 25/mês
- [ ] Rodar as migrações **001 → 007** no SQL Editor (se ainda houver alguma faltando)
- [ ] **Authentication → URL Configuration**:
  - Site URL = `https://SEU-DOMINIO`
  - Redirect URLs = `https://SEU-DOMINIO/auth/callback`
- [ ] (Recomendado) subir para **Pro**: backup diário + sem pausa por inatividade
- [ ] (Opcional, +US$ 10/mês) **Custom Domain** se quiser domínio amigável no login Google

### 4. Resend (e-mails)  · **P0** · Grátis (até 3k/mês)
- [ ] **Domains → Add Domain**: adicionar seu domínio e configurar os registros DNS (SPF/DKIM)
- [ ] Trocar `RESEND_FROM` para algo como `Farmácia do Povo <contato@SEU-DOMINIO>`
- [ ] Enviar um e-mail de teste (criar conta) e confirmar entrega (fora do spam)

### 5. Pagar.me (pagamentos)  · **P0** · sem mensalidade, taxa por venda
- [ ] Testar tudo em **sandbox** primeiro (chaves `sk_test`/`pk_test`) — ver `supabase/PAGARME_SETUP.md`
- [ ] Concluir o cadastro da empresa (CNPJ) para liberar o **modo produção**
- [ ] Trocar as chaves para produção (`sk_...` / `pk_...`) nas envs
- [ ] Cadastrar o **webhook** de produção: `https://SEU-DOMINIO/api/webhooks/pagarme`
      (eventos: `order.paid`, `charge.paid`, `charge.payment_failed`, `charge.refunded`)
- [ ] Confirmar/negociar as **taxas** (PIX ~1%, boleto ~R$2-3,50, cartão ~3,5%+R$0,39)

### 6. Google OAuth (login Gmail)  · **P1** · grátis
- [ ] Criar credenciais no Google Cloud (ver `supabase/OAUTH_SETUP.md`)
- [ ] Habilitar o provedor **Google** no Supabase
- [ ] Publicar a OAuth consent screen (App name + logo)

---

## PARTE 2 — O que falta CONSTRUIR (código)

### P0 — bloqueiam uma experiência de produção
- [ ] **Corrigir `NEXT_PUBLIC_APP_URL`** para a URL real de produção (hoje está
      `http://localhost:3000` → quebra links de e-mail e "acompanhar pedido")
- [ ] **Página de rastreio ligada ao banco**: `app/pedido/[id]/rastreio` ainda lê
      dados estáticos (`lib/orders`). O cliente clica em "Rastrear pedido" na conta
      e não vê o pedido real. → conectar ao Supabase (timeline via `historico_pedidos`)
- [ ] **Página de Termos de Uso**: o cadastro já diz "concorda com os Termos de Uso",
      mas a página não existe (só existe `politica-de-privacidade`)

### P1 — importantes para operar de verdade
- [ ] **Código de rastreio ao despachar**: o campo `codigo_rastreio` existe mas nunca
      é preenchido. Adicionar input na esteira (etapa "despachado"/"trânsito") — o
      e-mail de "enviado" já está pronto para incluí-lo
- [ ] **Cartão salvo como forma de pagamento no checkout** (selecionar em vez de
      digitar) — a estrutura `token_gateway` já existe

### P2 — desejáveis
- [ ] **Upload de receita pelo cliente** (na conta ou no checkout de itens que exigem
      receita) — hoje a fila do farmacêutico fica vazia porque não há como enviar receita
- [ ] **Links reais** de Instagram/WhatsApp no rodapé (hoje são placeholders)
- [ ] **Dados institucionais reais**: telefone, e-mail, CNPJ, endereço no rodapé/contato

---

## PARTE 3 — Legal & Regulatório  · **P0**
- [ ] **LGPD**: revisar a Política de Privacidade com dados reais da empresa; avaliar
      banner de consentimento de cookies (usamos analytics)
- [ ] **Termos de Uso** publicados (ver Parte 2)
- [ ] ⚠️ **Regulatório (farmácia)**: venda de manipulados no Brasil exige CNPJ,
      **licença sanitária/ANVISA** e **farmacêutico responsável**. Isso é jurídico/negócio,
      fora do escopo do código — mas é pré-requisito para operar legalmente. Confirme
      com contador/advogado antes de vender.

---

## PARTE 4 — Variáveis de ambiente (produção na Vercel)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_HOOK_SECRET=...

# App (URL REAL de produção — não localhost!)
NEXT_PUBLIC_APP_URL=https://SEU-DOMINIO

# Resend
RESEND_API_KEY=...
RESEND_FROM=Farmácia do Povo <contato@SEU-DOMINIO>

# Pagar.me (produção)
PAGARME_SECRET_KEY=sk_...
NEXT_PUBLIC_PAGARME_PUBLIC_KEY=pk_...
PAGARME_WEBHOOK_SECRET=...
```

---

## PARTE 5 — QA antes de virar a chave (testar em produção)
- [ ] Cadastro + confirmação de e-mail chega e funciona
- [ ] Login por e-mail e por Google
- [ ] Comprar com **cartão** (aprovado e recusado)
- [ ] Comprar com **PIX** (QR aparece; webhook marca "pago")
- [ ] Comprar com **boleto** (gera boleto; webhook marca "pago")
- [ ] E-mails: confirmação de pedido, "aprovado", "enviado"
- [ ] Esteira admin: avançar etapas, ver executor no histórico
- [ ] Conta: endereços (CRUD), cartões, rastreio do pedido
- [ ] Testar no celular (responsivo)

---

## PARTE 6 — Pós-lançamento
- [ ] Confirmar backup diário ativo (Supabase Pro)
- [ ] Acompanhar Vercel Analytics + logs de erro (Vercel + Supabase)
- [ ] Monitorar a fila de pagamentos pendentes (PIX/boleto não pagos)

---

## Resumo de custo mensal para "ficar de pé"

| Item | Enxuto | Recomendado |
|------|--------|-------------|
| Vercel Pro | R$ 120 | R$ 120 |
| Supabase | Grátis | R$ 150 (Pro) |
| Resend | Grátis | Grátis |
| Domínio | ~R$ 3 | ~R$ 3 |
| **Fixo/mês** | **~R$ 125** | **~R$ 275** |
| Pagar.me | por venda | por venda |
