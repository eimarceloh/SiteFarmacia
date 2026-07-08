// Tokenização do cartão NO NAVEGADOR usando a public key (pk_test_… / pk_…).
// O número do cartão e o CVV vão direto ao Pagar.me — nunca ao nosso servidor.

const BASE_URL = "https://api.pagar.me/core/v5"

export type DadosCartao = {
  numero: string        // só dígitos
  nomeTitular: string
  mes: number           // 1-12
  ano: number           // 4 dígitos
  cvv: string
}

export function pagarmePublicKey(): string | undefined {
  return process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY
}

// Retorna o card_token para enviar ao nosso backend.
export async function tokenizarCartao(card: DadosCartao): Promise<string> {
  const pk = pagarmePublicKey()
  if (!pk) throw new Error("Pagamento por cartão indisponível no momento.")

  const res = await fetch(`${BASE_URL}/tokens?appId=${encodeURIComponent(pk)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "card",
      card: {
        number: card.numero.replace(/\D/g, ""),
        holder_name: card.nomeTitular,
        exp_month: card.mes,
        exp_year: card.ano,
        cvv: card.cvv,
      },
    }),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.id) {
    const msg = data?.message ?? data?.errors?.[0]?.message ?? "Não foi possível validar o cartão."
    throw new Error(msg)
  }
  return data.id as string
}
