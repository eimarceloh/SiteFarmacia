export type OrderStatus = "confirmado" | "manipulacao" | "despachado" | "transito" | "entregue"

export type TimelineStep = {
  status: OrderStatus
  label: string
  description: string
  date?: string
  done: boolean
  active: boolean
}

export type Order = {
  id: string
  date: string
  total: number
  status: OrderStatus
  statusLabel: string
  items: { name: string; quantity: number; price: number }[]
  trackingCode?: string
  estimatedDelivery: string
  timeline: TimelineStep[]
}

export const STATUS_STYLES: Record<OrderStatus, string> = {
  confirmado:  "bg-blue-50 text-blue-700 border-blue-200",
  manipulacao: "bg-amber-50 text-amber-700 border-amber-200",
  despachado:  "bg-orange-50 text-orange-700 border-orange-200",
  transito:    "bg-violet-50 text-violet-700 border-violet-200",
  entregue:    "bg-emerald-50 text-emerald-700 border-emerald-200",
}

export const ORDERS: Order[] = [
  {
    id: "FP-847291",
    date: "12 Jun 2026",
    total: 179.80,
    status: "transito",
    statusLabel: "Em trânsito",
    trackingCode: "BR847291028BR",
    estimatedDelivery: "18 Jun 2026",
    items: [
      { name: "Termo Slim Fórmula", quantity: 1, price: 89.9 },
      { name: "Imuni Vita D3 + Zinco", quantity: 1, price: 69.9 },
    ],
    timeline: [
      { status: "confirmado",  label: "Pedido confirmado", description: "Seu pedido foi recebido e está aguardando processamento.", date: "12 Jun 2026, 14:23", done: true,  active: false },
      { status: "manipulacao", label: "Em manipulação",    description: "Nossa equipe farmacêutica está preparando sua fórmula com os ativos selecionados.",  date: "13 Jun 2026, 09:15", done: true,  active: false },
      { status: "despachado",  label: "Despachado",        description: "Seu pedido foi embalado e entregue à transportadora parceira.",  date: "14 Jun 2026, 11:40", done: true,  active: false },
      { status: "transito",    label: "Em trânsito",       description: "Seu pedido está a caminho. Acompanhe pelo código de rastreio.", date: "15 Jun 2026, 08:30", done: false, active: true  },
      { status: "entregue",    label: "Entregue",          description: "Pedido entregue com sucesso.", done: false, active: false },
    ],
  },
  {
    id: "FP-293847",
    date: "10 Jun 2026",
    total: 109.9,
    status: "manipulacao",
    statusLabel: "Em manipulação",
    estimatedDelivery: "19 Jun 2026",
    items: [
      { name: "Capilar Force Complex", quantity: 1, price: 109.9 },
    ],
    timeline: [
      { status: "confirmado",  label: "Pedido confirmado", description: "Seu pedido foi recebido e está aguardando processamento.", date: "10 Jun 2026, 10:05", done: true,  active: false },
      { status: "manipulacao", label: "Em manipulação",    description: "Nossa equipe farmacêutica está preparando sua fórmula com os ativos selecionados.", date: "11 Jun 2026, 08:50", done: false, active: true  },
      { status: "despachado",  label: "Despachado",        description: "Seu pedido será embalado e entregue à transportadora.", done: false, active: false },
      { status: "transito",    label: "Em trânsito",       description: "Seu pedido está a caminho.", done: false, active: false },
      { status: "entregue",    label: "Entregue",          description: "Pedido entregue com sucesso.", done: false, active: false },
    ],
  },
  {
    id: "FP-112233",
    date: "28 Mai 2026",
    total: 259.70,
    status: "entregue",
    statusLabel: "Entregue",
    trackingCode: "BR112233045BR",
    estimatedDelivery: "04 Jun 2026",
    items: [
      { name: "Colágeno Skin Glow", quantity: 1, price: 99.9 },
      { name: "Beauty Complex Pro",  quantity: 1, price: 89.9 },
      { name: "Imuni Vita D3 + Zinco", quantity: 1, price: 69.9 },
    ],
    timeline: [
      { status: "confirmado",  label: "Pedido confirmado", description: "Seu pedido foi recebido e processado.",                        date: "28 Mai 2026, 16:12", done: true, active: false },
      { status: "manipulacao", label: "Em manipulação",    description: "Fórmulas preparadas pela nossa equipe farmacêutica.",          date: "29 Mai 2026, 09:30", done: true, active: false },
      { status: "despachado",  label: "Despachado",        description: "Pedido embalado e entregue à transportadora.",                  date: "30 Mai 2026, 13:20", done: true, active: false },
      { status: "transito",    label: "Em trânsito",       description: "Pedido em rota de entrega.",                                    date: "02 Jun 2026, 07:45", done: true, active: false },
      { status: "entregue",    label: "Entregue",          description: "Pedido entregue com sucesso. Bom proveito!",                    date: "04 Jun 2026, 14:58", done: true, active: false },
    ],
  },
  {
    id: "FP-445566",
    date: "15 Jun 2026",
    total: 94.9,
    status: "confirmado",
    statusLabel: "Confirmado",
    estimatedDelivery: "23 Jun 2026",
    items: [
      { name: "Pré-Treino Explosivo", quantity: 1, price: 94.9 },
    ],
    timeline: [
      { status: "confirmado",  label: "Pedido confirmado", description: "Seu pedido foi recebido e está aguardando processamento.", date: "15 Jun 2026, 20:44", done: false, active: true  },
      { status: "manipulacao", label: "Em manipulação",    description: "Nossa equipe farmacêutica irá preparar sua fórmula.", done: false, active: false },
      { status: "despachado",  label: "Despachado",        description: "Seu pedido será embalado e entregue à transportadora.", done: false, active: false },
      { status: "transito",    label: "Em trânsito",       description: "Seu pedido está a caminho.", done: false, active: false },
      { status: "entregue",    label: "Entregue",          description: "Pedido entregue com sucesso.", done: false, active: false },
    ],
  },
]

export function getOrderById(id: string): Order | undefined {
  return ORDERS.find((o) => o.id === id)
}
