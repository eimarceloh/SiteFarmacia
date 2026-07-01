"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { STATUS_STYLES } from "@/lib/orders"
import { formatBRL } from "@/lib/products"
import {
  Package, User, MapPin, Lock, LogOut, ChevronRight,
  Eye, EyeOff, CheckCircle2, ShoppingBag, Home, LayoutDashboard,
} from "lucide-react"

type Pedido = {
  id: string
  numero_pedido: string
  status: string
  subtotal: number
  total: number
  criado_em: string
  itens_pedido: { nome_produto: string; quantidade: number; preco_unitario: number }[]
}

type Endereco = {
  id: string
  rotulo: string
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  cidade: string
  estado: string
  cep: string
  padrao: boolean
}

type Section = "pedidos" | "dados" | "enderecos" | "seguranca"

type UserData = { nome: string; email: string; telefone: string; cpf: string; pedidos: Pedido[]; enderecos: Endereco[]; podeAcessarAdmin?: boolean }

const NAV: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "pedidos",   label: "Meus pedidos",   icon: Package },
  { id: "dados",     label: "Dados pessoais", icon: User    },
  { id: "enderecos", label: "Endereços",       icon: MapPin  },
  { id: "seguranca", label: "Segurança",       icon: Lock    },
]


function inputClass() {
  return "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
}

const STATUS_LABELS: Record<string, string> = {
  confirmado:  "Confirmado",
  manipulacao: "Em manipulação",
  despachado:  "Despachado",
  transito:    "Em trânsito",
  entregue:    "Entregue",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

/* ── Seção: Meus Pedidos ── */
function PedidosSection({ pedidos }: { pedidos: Pedido[] }) {
  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
        <ShoppingBag className="size-12 text-muted-foreground/40" />
        <p className="font-heading font-bold text-foreground">Nenhum pedido ainda</p>
        <p className="text-sm text-muted-foreground">Quando você fizer um pedido, ele aparecerá aqui.</p>
        <Link href="/" className="mt-1 text-sm font-semibold text-primary hover:underline">
          Explorar produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {pedidos.map((pedido) => {
        const statusStyle = STATUS_STYLES[pedido.status as keyof typeof STATUS_STYLES] ?? "bg-gray-50 text-gray-700 border-gray-200"
        const statusLabel = STATUS_LABELS[pedido.status] ?? pedido.status
        return (
          <div key={pedido.id} className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading text-sm font-bold text-foreground">{pedido.numero_pedido}</p>
                <p className="text-xs text-muted-foreground">{formatDate(pedido.criado_em)}</p>
              </div>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle}`}>
                {statusLabel}
              </span>
            </div>

            <ul className="mb-3 space-y-1">
              {pedido.itens_pedido.map((item, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.quantidade}x {item.nome_produto}</span>
                  <span className="font-medium text-foreground">R$ {formatBRL(item.preco_unitario * item.quantidade)}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-border pt-3">
              <p className="font-heading text-sm font-extrabold text-foreground">
                Total: R$ {formatBRL(pedido.total)}
              </p>
              <Link
                href={`/pedido/${pedido.numero_pedido}/rastreio`}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Rastrear pedido
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Seção: Dados Pessoais ── */
function DadosSection({ user }: { user: UserData }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [nome, setNome] = useState(user.nome)
  const [email, setEmail] = useState(user.email)
  const [telefone, setTelefone] = useState(user.telefone)
  const [cpf, setCpf] = useState(user.cpf)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro(null)
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { setErro("Sessão expirada. Faça login novamente."); setLoading(false); return }

    const { error } = await supabase.from("clientes").upsert({
      id: authUser.id,
      email: authUser.email,
      nome_completo: nome,
      telefone,
      cpf,
    })

    setLoading(false)
    if (error) { setErro(`Erro ao salvar: ${error.message}`); return }
    setSaved(true)
  }

  return saved ? (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
      <CheckCircle2 className="size-10 text-primary" />
      <p className="font-heading font-bold text-foreground">Dados atualizados!</p>
      <button onClick={() => setSaved(false)} className="text-sm text-primary hover:underline">Editar novamente</button>
    </div>
  ) : (
    <form
      className="rounded-2xl border border-border bg-card p-6"
      onSubmit={handleSave}
    >
      <h2 className="mb-5 font-heading text-lg font-bold text-foreground">Dados pessoais</h2>
      <div className="grid gap-4 sm:grid-cols-2">

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Nome completo</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} className={inputClass()} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass()} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Telefone</label>
          <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} className={inputClass()} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">CPF</label>
          <input
            value={cpf}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 11)
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
              setCpf(v)
            }}
            placeholder="000.000.000-00"
            inputMode="numeric"
            className={inputClass()}
          />
        </div>
      </div>
      {erro && (
        <p className="mt-3 text-sm text-destructive">{erro}</p>
      )}
      <Button type="submit" className="mt-4" disabled={loading}>
        {loading ? "Salvando…" : "Salvar alterações"}
      </Button>
    </form>
  )
}

/* ── Seção: Endereços ── */
function EnderecosSection({ enderecos }: { enderecos: Endereco[] }) {
  return (
    <div className="flex flex-col gap-4">
      {enderecos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
          <Home className="size-12 text-muted-foreground/40" />
          <p className="font-heading font-bold text-foreground">Nenhum endereço cadastrado</p>
          <p className="text-sm text-muted-foreground">Adicione um endereço para facilitar suas compras.</p>
        </div>
      ) : (
        enderecos.map((addr) => (
          <div key={addr.id} className="relative rounded-2xl border border-border bg-card p-5">
            {addr.padrao && (
              <span className="absolute right-4 top-4 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Principal
              </span>
            )}
            <p className="font-semibold text-foreground">{addr.rotulo}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {addr.logradouro}, {addr.numero}{addr.complemento ? ` — ${addr.complemento}` : ""}<br />
              {addr.bairro} — {addr.cidade}/{addr.estado} · CEP {addr.cep}
            </p>
            <button className="mt-3 text-xs font-medium text-primary hover:underline">Editar</button>
          </div>
        ))
      )}
      <button className="rounded-2xl border border-dashed border-border p-5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary">
        + Adicionar endereço
      </button>
    </div>
  )
}

/* ── Seção: Segurança ── */
function SegurancaSection() {
  const [show, setShow] = useState({ atual: false, nova: false, confirma: false })
  const [saved, setSaved] = useState(false)

  const toggle = (field: keyof typeof show) => setShow((s) => ({ ...s, [field]: !s[field] }))

  return saved ? (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
      <CheckCircle2 className="size-10 text-primary" />
      <p className="font-heading font-bold text-foreground">Senha atualizada com sucesso!</p>
      <button onClick={() => setSaved(false)} className="text-sm text-primary hover:underline">Alterar novamente</button>
    </div>
  ) : (
    <form
      className="rounded-2xl border border-border bg-card p-6"
      onSubmit={(e) => { e.preventDefault(); setSaved(true) }}
    >
      <h2 className="mb-5 font-heading text-lg font-bold text-foreground">Alterar senha</h2>
      <div className="flex flex-col gap-4">
        {(["atual", "nova", "confirma"] as const).map((field) => {
          const labels = { atual: "Senha atual", nova: "Nova senha", confirma: "Confirmar nova senha" }
          return (
            <div key={field}>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{labels[field]}</label>
              <div className="relative">
                <input
                  type={show[field] ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-4 pr-11 text-sm outline-none ring-ring focus-visible:ring-2"
                />
                <button
                  type="button"
                  onClick={() => toggle(field)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show[field] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      <Button type="submit" className="mt-6">Salvar nova senha</Button>
    </form>
  )
}

/* ── Painel principal ── */
export function AccountPanel({ nome, email, telefone, cpf, pedidos, enderecos, podeAcessarAdmin }: UserData) {
  const [active, setActive] = useState<Section>("pedidos")
  const activeSection = NAV.find((n) => n.id === active)!
  const user: UserData = { nome, email, telefone, cpf, pedidos, enderecos }

  const content: Record<Section, React.ReactNode> = {
    pedidos:   <PedidosSection pedidos={pedidos} />,
    dados:     <DadosSection user={user} />,
    enderecos: <EnderecosSection enderecos={enderecos} />,
    seguranca: <SegurancaSection />,
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="flex gap-8 lg:items-start">

        {/* ── Sidebar desktop ── */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary font-heading text-lg font-extrabold text-primary-foreground">
              {nome ? nome.charAt(0).toUpperCase() : "?"}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{nome || "—"}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active === id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </button>
            ))}
            {podeAcessarAdmin && (
              <Link
                href="/admin"
                className="mt-2 flex w-full items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20"
              >
                <LayoutDashboard className="size-4 shrink-0" />
                Painel admin
              </Link>
            )}
            <Link
              href="/"
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="size-4 shrink-0" />
              Sair
            </Link>
          </nav>
        </aside>

        {/* ── Conteúdo ── */}
        <div className="flex-1 min-w-0">
          {/* Nav mobile */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active === id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>

          <h1 className="mb-6 font-heading text-2xl font-bold text-foreground">
            {activeSection.label}
          </h1>

          {content[active]}
        </div>
      </div>
    </div>
  )
}
