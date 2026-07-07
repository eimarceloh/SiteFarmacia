# Login social (Google, Microsoft, Apple)

O código já está pronto: os botões "Continuar com…" chamam
`supabase.auth.signInWithOAuth()` e o retorno é tratado em
`app/auth/callback/route.ts` (mesmo fluxo do e-mail). Falta apenas **habilitar
os provedores no painel do Supabase** e criar as credenciais em cada console.

Mapa de provedores (código → Supabase):
`google → google`, `microsoft → azure`, `apple → apple`.

## 1. URLs de redirect (configurar uma vez no Supabase)

Supabase Dashboard → **Authentication → URL Configuration**:

- **Site URL:** `https://site-farmacia-eight.vercel.app`
- **Redirect URLs** (adicione todas):
  - `https://site-farmacia-eight.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback`

O **callback que os provedores externos usam** é sempre o do Supabase:
`https://<SEU-PROJETO>.supabase.co/auth/v1/callback`
(copie o valor exato em Authentication → Providers → [provedor]).

## 2. Google

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**.
2. **Create Credentials → OAuth client ID → Web application**.
3. Em **Authorized redirect URIs**, cole o callback do Supabase
   (`https://<projeto>.supabase.co/auth/v1/callback`).
4. Copie **Client ID** e **Client Secret**.
5. Supabase → Authentication → Providers → **Google** → cole os dois valores → **Enable** → Save.

## 3. Microsoft (Azure)

1. [Portal Azure](https://portal.azure.com/) → **Microsoft Entra ID → App registrations → New registration**.
2. Supported account types: **Accounts in any organizational directory and personal Microsoft accounts**.
3. **Redirect URI (Web):** callback do Supabase.
4. Em **Certificates & secrets**, crie um **client secret** e copie o *Value*.
5. Copie o **Application (client) ID**.
6. Supabase → Authentication → Providers → **Azure** → cole Client ID + Secret.
   - Azure URL pode ficar como `https://login.microsoftonline.com/common` (aceita
     contas pessoais e corporativas). Save + Enable.

## 4. Apple

Requer conta paga no **Apple Developer Program**.

1. [Apple Developer](https://developer.apple.com/account/resources/identifiers/list) →
   crie um **App ID** e um **Services ID** (este último é o `client_id`).
2. Configure o Services ID com **Sign in with Apple** e adicione o domínio +
   o **Return URL** = callback do Supabase.
3. Crie uma **Key** com Sign in with Apple; baixe o `.p8` e gere o *client secret*
   (JWT) conforme a doc do Supabase.
4. Supabase → Authentication → Providers → **Apple** → informe Services ID +
   secret. Save + Enable.

> Dica: comece por **Google** (mais simples e cobre Gmail). Microsoft e Apple
> podem ser habilitados depois — os botões só funcionam após o provedor estar
> ativo; enquanto isso, o Supabase retorna erro "provider is not enabled".

## Observações

- Novos usuários via OAuth caem no trigger `fn_novo_usuario` e recebem
  automaticamente o papel `cliente` + linha em `clientes` (com e-mail).
- O nome vem em `user_metadata.full_name`; o usuário pode completar CPF/telefone
  depois em **Minha conta**.
