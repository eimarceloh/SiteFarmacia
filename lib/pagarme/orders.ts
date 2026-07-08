// Criação de cobrança no Pagar.me (API v5). USO NO SERVIDOR.
import { pagarmeFetch } from "./client"

export type MetodoPagamento = "credit_card" | "pix" | "boleto"

export type ItemCobranca = {
  descricao: string
  valorCentavos: number   // valor unitário em centavos
  quantidade: number
}

export type ClienteCobranca = {
  nome: string
  email: string
  documento: string       // CPF (só dígitos)
  telefone?: string       // só dígitos, com DDD
}

export type CriarCobrancaInput = {
  codigoPedido: string    // numero_pedido (usado para mapear no webhook)
  metodo: MetodoPagamento
  itens: ItemCobranca[]
  cliente: ClienteCobranca
  cardToken?: string      // obrigatório para credit_card
  parcelas?: number
}

export type CobrancaResult = {
  pagarmeId: string
  status: string          // paid | pending | processing | failed | canceled
  pago: boolean
  pix?: { qrCode: string; qrCodeUrl: string; expiraEm?: string }
  boleto?: { url: string; linhaDigitavel: string }
  motivoFalha?: string
}

function parsePhone(tel?: string) {
  const d = (tel ?? "").replace(/\D/g, "")
  if (d.length < 10) return undefined
  return {
    mobile_phone: {
      country_code: "55",
      area_code: d.slice(0, 2),
      number: d.slice(2),
    },
  }
}

export async function criarCobranca(input: CriarCobrancaInput): Promise<CobrancaResult> {
  const { codigoPedido, metodo, itens, cliente, cardToken, parcelas } = input

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payment: any = { payment_method: metodo }

  if (metodo === "credit_card") {
    payment.credit_card = {
      installments: parcelas && parcelas > 0 ? parcelas : 1,
      statement_descriptor: "FARMAPOVO",
      card_token: cardToken,
    }
  } else if (metodo === "pix") {
    payment.pix = { expires_in: 3600 } // 1h
  } else {
    // boleto — vence em 3 dias
    const due = new Date()
    due.setDate(due.getDate() + 3)
    payment.boleto = {
      due_at: due.toISOString(),
      instructions: "Pagar até o vencimento. Não receber após o vencimento.",
    }
  }

  const phones = parsePhone(cliente.telefone)

  const body = {
    code: codigoPedido,
    items: itens.map((i) => ({
      amount: i.valorCentavos,
      description: i.descricao.slice(0, 64),
      quantity: i.quantidade,
    })),
    customer: {
      name: cliente.nome,
      email: cliente.email,
      type: "individual",
      document: cliente.documento.replace(/\D/g, ""),
      ...(phones ? { phones } : {}),
    },
    payments: [payment],
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = await pagarmeFetch<any>("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  })

  const charge = order?.charges?.[0]
  const tx = charge?.last_transaction
  const status: string = order?.status ?? charge?.status ?? "pending"
  const pago = status === "paid" || charge?.status === "paid"

  const result: CobrancaResult = {
    pagarmeId: order?.id ?? "",
    status,
    pago,
  }

  if (metodo === "pix" && tx) {
    result.pix = {
      qrCode: tx.qr_code ?? "",
      qrCodeUrl: tx.qr_code_url ?? "",
      expiraEm: tx.expires_at ?? undefined,
    }
  }

  if (metodo === "boleto" && tx) {
    result.boleto = {
      url: tx.url ?? tx.pdf ?? "",
      linhaDigitavel: tx.line ?? tx.barcode ?? "",
    }
  }

  if (metodo === "credit_card" && !pago) {
    result.motivoFalha =
      tx?.acquirer_message ?? tx?.gateway_response?.errors?.[0]?.message ?? "Pagamento não autorizado."
  }

  return result
}
