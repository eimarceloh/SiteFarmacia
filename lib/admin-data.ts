import type { OrderStatus } from "@/lib/orders"

export type AdminOrder = {
  id: string
  customer: string
  email: string
  date: string
  items: number
  total: number
  status: OrderStatus
  statusLabel: string
  payment: "cartao" | "pix"
}

export const ADMIN_ORDERS: AdminOrder[] = [
  { id: "FP-847291", customer: "Maria Silva",       email: "maria@email.com",     date: "17 Jun 2026", items: 2, total: 179.80, status: "transito",    statusLabel: "Em trânsito",    payment: "pix"    },
  { id: "FP-445566", customer: "João Pereira",      email: "joao@email.com",      date: "15 Jun 2026", items: 1, total: 94.90,  status: "confirmado",  statusLabel: "Confirmado",     payment: "cartao" },
  { id: "FP-293847", customer: "Fernanda Costa",    email: "fern@email.com",      date: "10 Jun 2026", items: 1, total: 109.90, status: "manipulacao", statusLabel: "Em manipulação", payment: "pix"    },
  { id: "FP-112233", customer: "Carlos Mendonça",   email: "carlos@email.com",    date: "28 Mai 2026", items: 3, total: 259.70, status: "entregue",    statusLabel: "Entregue",       payment: "cartao" },
  { id: "FP-339912", customer: "Ana Rodrigues",     email: "ana@email.com",       date: "14 Jun 2026", items: 2, total: 164.80, status: "despachado",  statusLabel: "Despachado",     payment: "pix"    },
  { id: "FP-228847", customer: "Luciana Ferreira",  email: "luci@email.com",      date: "13 Jun 2026", items: 1, total: 89.90,  status: "manipulacao", statusLabel: "Em manipulação", payment: "cartao" },
  { id: "FP-774412", customer: "Roberto Alves",     email: "rob@email.com",       date: "12 Jun 2026", items: 2, total: 209.80, status: "transito",    statusLabel: "Em trânsito",    payment: "pix"    },
  { id: "FP-556631", customer: "Tatiana Lima",      email: "tati@email.com",      date: "11 Jun 2026", items: 1, total: 119.90, status: "despachado",  statusLabel: "Despachado",     payment: "cartao" },
  { id: "FP-991122", customer: "Eduardo Bastos",    email: "edu@email.com",       date: "09 Jun 2026", items: 2, total: 174.80, status: "entregue",    statusLabel: "Entregue",       payment: "pix"    },
  { id: "FP-663344", customer: "Patrícia Souza",    email: "pat@email.com",       date: "08 Jun 2026", items: 3, total: 299.70, status: "entregue",    statusLabel: "Entregue",       payment: "cartao" },
  { id: "FP-112900", customer: "Diego Nascimento",  email: "diego@email.com",     date: "07 Jun 2026", items: 1, total: 74.90,  status: "entregue",    statusLabel: "Entregue",       payment: "pix"    },
  { id: "FP-887765", customer: "Vanessa Martins",   email: "vanessa@email.com",   date: "06 Jun 2026", items: 2, total: 199.80, status: "entregue",    statusLabel: "Entregue",       payment: "cartao" },
  { id: "FP-543210", customer: "Felipe Gomes",      email: "felipe@email.com",    date: "05 Jun 2026", items: 1, total: 99.90,  status: "entregue",    statusLabel: "Entregue",       payment: "pix"    },
  { id: "FP-321098", customer: "Isabela Torres",    email: "isa@email.com",       date: "04 Jun 2026", items: 2, total: 189.80, status: "entregue",    statusLabel: "Entregue",       payment: "cartao" },
  { id: "FP-765432", customer: "Marcos Vieira",     email: "marcos@email.com",    date: "03 Jun 2026", items: 1, total: 109.90, status: "entregue",    statusLabel: "Entregue",       payment: "pix"    },
  { id: "FP-209876", customer: "Renata Campos",     email: "renata@email.com",    date: "16 Jun 2026", items: 1, total: 79.90,  status: "confirmado",  statusLabel: "Confirmado",     payment: "pix"    },
  { id: "FP-348812", customer: "Gustavo Pinto",     email: "gus@email.com",       date: "16 Jun 2026", items: 2, total: 184.80, status: "confirmado",  statusLabel: "Confirmado",     payment: "cartao" },
  { id: "FP-501234", customer: "Aline Carvalho",    email: "aline@email.com",     date: "15 Jun 2026", items: 1, total: 94.90,  status: "confirmado",  statusLabel: "Confirmado",     payment: "pix"    },
  { id: "FP-678901", customer: "Thiago Moraes",     email: "thiago@email.com",    date: "14 Jun 2026", items: 3, total: 314.70, status: "manipulacao", statusLabel: "Em manipulação", payment: "cartao" },
  { id: "FP-890123", customer: "Sofia Cardoso",     email: "sofia@email.com",     date: "13 Jun 2026", items: 2, total: 219.80, status: "despachado",  statusLabel: "Despachado",     payment: "pix"    },
]

export const WEEKLY_REVENUE = [
  { label: "28/04", value: 1840 },
  { label: "05/05", value: 2310 },
  { label: "12/05", value: 1950 },
  { label: "19/05", value: 2780 },
  { label: "26/05", value: 3120 },
  { label: "02/06", value: 2650 },
  { label: "09/06", value: 3480 },
  { label: "16/06", value: 2940 },
]

export const TOP_PRODUCTS = [
  { name: "Termo Slim Fórmula",    sales: 48, revenue: 4315.20 },
  { name: "Imuni Vita D3 + Zinco", sales: 41, revenue: 2865.90 },
  { name: "Capilar Force Complex", sales: 37, revenue: 4066.30 },
  { name: "Colágeno Skin Glow",    sales: 34, revenue: 3396.60 },
  { name: "Pré-Treino Explosivo",  sales: 29, revenue: 2752.10 },
]

export const STATUS_STYLES_ADMIN = {
  confirmado:  "bg-blue-50 text-blue-700 border-blue-200",
  manipulacao: "bg-amber-50 text-amber-700 border-amber-200",
  despachado:  "bg-orange-50 text-orange-700 border-orange-200",
  transito:    "bg-violet-50 text-violet-700 border-violet-200",
  entregue:    "bg-emerald-50 text-emerald-700 border-emerald-200",
} as const
