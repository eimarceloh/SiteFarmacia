// Client HTTP do Pagar.me (API v5 / Core). USO EXCLUSIVO NO SERVIDOR.
// A secret key (sk_test_… / sk_…) nunca pode ir para o navegador.

const BASE_URL = "https://api.pagar.me/core/v5"

export function pagarmeConfigurado(): boolean {
  return !!process.env.PAGARME_SECRET_KEY
}

export class PagarmeError extends Error {
  status: number
  detalhe: unknown
  constructor(message: string, status: number, detalhe: unknown) {
    super(message)
    this.name = "PagarmeError"
    this.status = status
    this.detalhe = detalhe
  }
}

function authHeader(): string {
  const key = process.env.PAGARME_SECRET_KEY
  if (!key) throw new PagarmeError("PAGARME_SECRET_KEY não configurada.", 500, null)
  // Basic auth: secret key como usuário, senha vazia
  return "Basic " + Buffer.from(`${key}:`).toString("base64")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function pagarmeFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    // Pagar.me retorna { message, errors: {...} }
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any)?.message ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (data as any)?.errors?.[0]?.message ??
      "Erro ao comunicar com o Pagar.me."
    throw new PagarmeError(msg, res.status, data)
  }

  return data as T
}
