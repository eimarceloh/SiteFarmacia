// GET /api/auth/permissoes
// Retorna a lista de permissões do usuário logado.
// Usado pelo PermissoesProvider no frontend para adaptar a UI.
// Não expõe nenhum dado sensível — apenas as chaves de permissão.

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ permissoes: [] })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).rpc("fn_minhas_permissoes")

  if (error) {
    console.error("[/api/auth/permissoes]", error.message)
    return NextResponse.json({ permissoes: [] })
  }

  return NextResponse.json({ permissoes: data ?? [] })
}
