"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ORDERS, STATUS_STYLES } from "@/lib/orders"
import { formatBRL } from "@/lib/products"
import {
  Package, User, MapPin, Lock, LogOut, ChevronRight,
  Eye, EyeOff, CheckCircle2,
} from "lucide-react"

type Section = "pedidos" | "dados" | "enderecos" | "seguranca"

const NAV: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "pedidos",   label: "Meus pedidos",   icon: Package },
  { id: "dados",     label: "Dados pessoais", icon: User    },
  { id: "enderecos", label: "Endereços",       icon: MapPin  },
  { id: "seguranca", label: "Segurança",       icon: Lock    },
]

const MOCK_USER = { name: "Maria Silva", email: "maria@email.com", phone: "(11) 98765-4321", cpf: "123.456.789-00" }

const MOCK_ADDRESSES = [
  { id: 1, label: "Casa", street: "Rua das Flores, 123", complement: "Apto 42", neighborhood: "Jardim Paulista", city: "São Paulo", state: "SP", cep: "01310-100", main: true },
  { id: 2, label: "Trabalho", street: "Av. Paulista, 1000", complement: "Sala 501", neighborhood: "Bela Vista", city: "São Paulo", state: "SP", cep: "01310-200", main: false },
]

function inputClass() {
  return "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
}

/* ── Seção: Meus Pedidos ── */
function PedidosSection() {
  return (
    <div className="flex flex-col gap-4">
      {ORDERS.map((order) => (
        <div key={order.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-heading text-sm font-bold text-foreground">{order.id}</p>
              <p className="text-xs text-muted-foreground">{order.date}</p>
            </div>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
              {order.statusLabel}
            </span>
          </div>

          <ul className="mb-3 space-y-1">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.quantity}x {item.name}</span>
                <span className="font-medium text-foreground">R$ {formatBRL(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-border pt-3">
            <p className="font-heading text-sm font-extrabold text-foreground">
              Total: R$ {formatBRL(order.total)}
            </p>
            <Link
              href={`/pedido/${order.id}/rastreio`}
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Rastrear pedido
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Seção: Dados Pessoais ── */
function DadosSection() {
  const [saved, setSaved] = useState(false)

  return saved ? (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
      <CheckCircle2 className="size-10 text-primary" />
      <p className="font-heading font-bold text-foreground">Dados atualizados!</p>
      <button onClick={() => setSaved(false)} className="text-sm text-primary hover:underline">Editar novamente</button>
    </div>
  ) : (
    <form
      className="rounded-2xl border border-border bg-card p-6"
      onSubmit={(e) => { e.preventDefault(); setSaved(true) }}
    >
      <h2 className="mb-5 font-heading text-lg font-bold text-foreground">Dados pessoais</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Nome completo</label>
          <input defaultValue={MOCK_USER.name} className={inputClass()} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
          <input type="email" defaultValue={MOCK_USER.email} className={inputClass()} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Telefone</label>
          <input type="tel" defaultValue={MOCK_USER.phone} className={inputClass()} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">CPF</label>
          <input defaultValue={MOCK_USER.cpf} disabled className={`${inputClass()} cursor-not-allowed opacity-60`} />
          <p className="mt-1 text-xs text-muted-foreground">O CPF não pode ser alterado.</p>
        </div>
      </div>
      <Button type="submit" className="mt-6">Salvar alterações</Button>
    </form>
  )
}

/* ── Seção: Endereços ── */
function EnderecosSection() {
  return (
    <div className="flex flex-col gap-4">
      {MOCK_ADDRESSES.map((addr) => (
        <div key={addr.id} className="relative rounded-2xl border border-border bg-card p-5">
          {addr.main && (
            <span className="absolute right-4 top-4 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Principal
            </span>
          )}
          <p className="font-semibold text-foreground">{addr.label}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {addr.street}{addr.complement ? `, ${addr.complement}` : ""}<br />
            {addr.neighborhood} — {addr.city}/{addr.state} · CEP {addr.cep}
          </p>
          <button className="mt-3 text-xs font-medium text-primary hover:underline">Editar</button>
        </div>
      ))}
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
export function AccountPanel() {
  const [active, setActive] = useState<Section>("pedidos")
  const activeSection = NAV.find((n) => n.id === active)!

  const content: Record<Section, React.ReactNode> = {
    pedidos:   <PedidosSection />,
    dados:     <DadosSection />,
    enderecos: <EnderecosSection />,
    seguranca: <SegurancaSection />,
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <div className="flex gap-8 lg:items-start">

        {/* ── Sidebar desktop ── */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary font-heading text-lg font-extrabold text-primary-foreground">
              {MOCK_USER.name.charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{MOCK_USER.name}</p>
              <p className="truncate text-xs text-muted-foreground">{MOCK_USER.email}</p>
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
            <Link
              href="/"
              className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
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
