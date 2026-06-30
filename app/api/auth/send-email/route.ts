import { NextResponse } from "next/server"
import { sendAccountConfirmation } from "@/lib/email"

// Payload que o Supabase envia no Auth Hook "send_email"
type SupabaseEmailHookPayload = {
  user: {
    id: string
    email: string
    user_metadata?: { nome_completo?: string; full_name?: string }
  }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    email_action_type: "signup" | "recovery" | "email_change" | "invite"
    site_url: string
  }
}

export async function POST(request: Request) {
  // Verifica o segredo compartilhado para garantir que a requisição vem do Supabase
  const secret = process.env.SUPABASE_HOOK_SECRET
  if (secret) {
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
    }
  }

  let payload: SupabaseEmailHookPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 })
  }

  const { user, email_data } = payload
  const nome =
    user.user_metadata?.nome_completo ??
    user.user_metadata?.full_name ??
    user.email.split("@")[0]

  // Monta o link de confirmação usando o token_hash do Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? email_data.site_url

  const confirmationUrl =
    `${supabaseUrl}/auth/v1/verify` +
    `?token=${email_data.token_hash}` +
    `&type=${email_data.email_action_type}` +
    `&redirect_to=${encodeURIComponent(`${appUrl}/auth/callback?type=signup`)}`

  if (email_data.email_action_type === "signup") {
    await sendAccountConfirmation({
      to: user.email,
      nome,
      confirmationUrl,
    })
  }

  // Supabase espera uma resposta vazia com status 200
  return new Response(null, { status: 204 })
}
