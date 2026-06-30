import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { sendWelcomeEmail } from "@/lib/email"

// Supabase redireciona aqui após:
// - confirmação de e-mail no cadastro  (type=signup)
// - link de redefinição de senha       (next=/auth/nova-senha)
// - login via magic link
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type")   // "signup" quando vem da confirmação de conta
  const next = searchParams.get("next") ?? "/conta"

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          },
        },
      },
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Confirmação de nova conta — envia boas-vindas e redireciona para página de sucesso
      if (type === "signup") {
        const nome =
          data.user.user_metadata?.nome_completo ??
          data.user.user_metadata?.full_name ??
          data.user.email?.split("@")[0] ??
          "Cliente"

        // Não bloqueia o redirect se o e-mail falhar
        sendWelcomeEmail({ to: data.user.email!, nome }).catch((err) =>
          console.error("[callback] Falha no e-mail de boas-vindas:", err),
        )

        return NextResponse.redirect(`${origin}/auth/confirmado`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Algo deu errado — volta ao login com mensagem de erro
  return NextResponse.redirect(`${origin}/login?erro=link_invalido`)
}
