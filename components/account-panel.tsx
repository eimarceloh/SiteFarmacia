"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { salvarEndereco, excluirEndereco, definirEnderecoPadrao, type EnderecoInput } from "@/app/conta/actions"
import { salvarCartao, excluirCartao, definirCartaoPadrao } from "@/app/conta/cartoes-actions"
import { STATUS_STYLES } from "@/lib/orders"
import { formatBRL } from "@/lib/products"
import {
  Package, User, MapPin, Lock, LogOut, ChevronRight,
  Eye, EyeOff, CheckCircle2, ShoppingBag, Home, LayoutDashboard,
  Pencil, Trash2, Plus, Star, Loader2, X, CreditCard, ShieldCheck,
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

type Cartao = {
  id: string
  bandeira: string
  ultimos4: string
  validade_mes: number
  validade_ano: number
  nome_titular: string
  padrao: boolean
}

type Section = "pedidos" | "dados" | "enderecos" | "cartoes" | "seguranca"

type UserData = {
  nome: string; email: string; telefone: string; cpf: string
  pedidos: Pedido[]; enderecos: Endereco[]; cartoes: Cartao[]; podeAcessarAdmin?: boolean
}

const NAV: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "pedidos",   label: "Meus pedidos",   icon: Package    },
  { id: "dados",     label: "Dados pessoais", icon: User       },
  { id: "enderecos", label: "Endereços",       icon: MapPin     },
  { id: "cartoes",   label: "Cartões",         icon: CreditCard },
  { id: "seguranca", label: "Segurança",       icon: Lock       },
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
type FormState = EnderecoInput

const EMPTY_FORM: FormState = {
  rotulo: "Casa", logradouro: "", numero: "", complemento: "",
  bairro: "", cidade: "", estado: "", cep: "", padrao: false,
}

function maskCep(v: string) {
  return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2")
}

function EnderecoForm({
  initial,
  onDone,
  onCancel,
}: {
  initial: FormState
  onDone: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<FormState>(initial)
  const [erro, setErro] = useState<string | null>(null)
  const [cepLoading, setCepLoading] = useState(false)
  const [saving, startSaving] = useTransition()

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }))

  async function buscarCep(cepRaw: string) {
    const cep = cepRaw.replace(/\D/g, "")
    if (cep.length !== 8) return
    setCepLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await res.json()
      if (!data.erro) {
        set({
          logradouro: data.logradouro || form.logradouro,
          bairro:     data.bairro     || form.bairro,
          cidade:     data.localidade  || form.cidade,
          estado:     data.uf          || form.estado,
        })
      }
    } catch {
      // sem conexão com ViaCEP — usuário preenche manualmente
    } finally {
      setCepLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    startSaving(async () => {
      const res = await salvarEndereco(form)
      if (res.error) { setErro(res.error); return }
      onDone()
    })
  }

  const field = "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">
          {form.id ? "Editar endereço" : "Novo endereço"}
        </h3>
        <button type="button" onClick={onCancel} aria-label="Fechar" className="text-muted-foreground hover:text-foreground">
          <X className="size-5" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Rótulo</label>
          <input value={form.rotulo} onChange={(e) => set({ rotulo: e.target.value })} placeholder="Casa, Trabalho…" className={field} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">CEP</label>
          <div className="relative">
            <input
              value={form.cep}
              onChange={(e) => set({ cep: maskCep(e.target.value) })}
              onBlur={(e) => buscarCep(e.target.value)}
              placeholder="00000-000"
              inputMode="numeric"
              className={field}
            />
            {cepLoading && <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Número</label>
          <input value={form.numero} onChange={(e) => set({ numero: e.target.value })} className={field} />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Logradouro</label>
          <input value={form.logradouro} onChange={(e) => set({ logradouro: e.target.value })} className={field} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Complemento</label>
          <input value={form.complemento ?? ""} onChange={(e) => set({ complemento: e.target.value })} placeholder="Apto, bloco… (opcional)" className={field} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Bairro</label>
          <input value={form.bairro} onChange={(e) => set({ bairro: e.target.value })} className={field} />
        </div>
        <div className="grid grid-cols-[1fr_88px] gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Cidade</label>
            <input value={form.cidade} onChange={(e) => set({ cidade: e.target.value })} className={field} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">UF</label>
            <input value={form.estado} onChange={(e) => set({ estado: e.target.value.toUpperCase().slice(0, 2) })} maxLength={2} className={field} />
          </div>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={form.padrao} onChange={(e) => set({ padrao: e.target.checked })} className="size-4 rounded border-input" />
        Definir como endereço principal
      </label>

      {erro && <p className="mt-3 text-sm text-destructive">{erro}</p>}

      <div className="mt-5 flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar endereço"}</Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancelar</Button>
      </div>
    </form>
  )
}

function EnderecosSection({ enderecos }: { enderecos: Endereco[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<FormState | null>(null)  // null = form fechado
  const [busyId, setBusyId] = useState<string | null>(null)
  const [, startAction] = useTransition()

  function refresh() {
    setEditing(null)
    router.refresh()
  }

  function handleExcluir(id: string) {
    setBusyId(id)
    startAction(async () => {
      await excluirEndereco(id)
      setBusyId(null)
      router.refresh()
    })
  }

  function handlePadrao(id: string) {
    setBusyId(id)
    startAction(async () => {
      await definirEnderecoPadrao(id)
      setBusyId(null)
      router.refresh()
    })
  }

  if (editing) {
    return <EnderecoForm initial={editing} onDone={refresh} onCancel={() => setEditing(null)} />
  }

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
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Star className="size-3 fill-primary" /> Principal
              </span>
            )}
            <p className="font-semibold text-foreground">{addr.rotulo}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {addr.logradouro}, {addr.numero}{addr.complemento ? ` — ${addr.complemento}` : ""}<br />
              {addr.bairro} — {addr.cidade}/{addr.estado} · CEP {maskCep(addr.cep)}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setEditing({
                  id: addr.id, rotulo: addr.rotulo, logradouro: addr.logradouro, numero: addr.numero,
                  complemento: addr.complemento ?? "", bairro: addr.bairro, cidade: addr.cidade,
                  estado: addr.estado, cep: addr.cep, padrao: addr.padrao,
                })}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Pencil className="size-3.5" /> Editar
              </button>
              {!addr.padrao && (
                <button
                  onClick={() => handlePadrao(addr.id)}
                  disabled={busyId === addr.id}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary disabled:opacity-50"
                >
                  <Star className="size-3.5" /> Tornar principal
                </button>
              )}
              <button
                onClick={() => handleExcluir(addr.id)}
                disabled={busyId === addr.id}
                className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline disabled:opacity-50"
              >
                <Trash2 className="size-3.5" /> Excluir
              </button>
            </div>
          </div>
        ))
      )}
      <button
        onClick={() => setEditing({ ...EMPTY_FORM })}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-4" /> Adicionar endereço
      </button>
    </div>
  )
}

/* ── Seção: Cartões ── */
const BANDEIRA_LABEL: Record<string, string> = {
  visa: "Visa", mastercard: "Mastercard", amex: "Amex", elo: "Elo",
  hipercard: "Hipercard", diners: "Diners", discover: "Discover", desconhecida: "Cartão",
}

// Algoritmo de Luhn — validação básica do número no navegador (não é cobrança)
function luhnValido(num: string): boolean {
  if (num.length < 13) return false
  let soma = 0
  let alt = false
  for (let i = num.length - 1; i >= 0; i--) {
    let d = parseInt(num[i], 10)
    if (alt) { d *= 2; if (d > 9) d -= 9 }
    soma += d
    alt = !alt
  }
  return soma % 10 === 0
}

function detectarBandeira(num: string): string {
  if (/^4/.test(num)) return "visa"
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(num)) return "mastercard"
  if (/^3[47]/.test(num)) return "amex"
  if (/^(606282|3841)/.test(num)) return "hipercard"
  if (/^(4011|4312|4389|504175|451416|5067|5090|6277|6362|6363|650|6516|6550)/.test(num)) return "elo"
  if (/^3(0[0-5]|[68])/.test(num)) return "diners"
  if (/^6(011|5)/.test(num)) return "discover"
  return "desconhecida"
}

function maskCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ").trim()
}

function CartaoForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [numero, setNumero] = useState("")
  const [validade, setValidade] = useState("")
  const [cvv, setCvv] = useState("")            // usado só para validação local; NUNCA enviado
  const [nome, setNome] = useState("")
  const [padrao, setPadrao] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()

  const digitos = numero.replace(/\D/g, "")
  const bandeira = detectarBandeira(digitos)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)

    if (!luhnValido(digitos)) { setErro("Número de cartão inválido."); return }
    if (cvv.replace(/\D/g, "").length < 3) { setErro("CVV inválido."); return }
    const m = validade.match(/^(\d{2})\/(\d{2})$/)
    if (!m) { setErro("Validade no formato MM/AA."); return }
    const mes = parseInt(m[1], 10)
    const ano = 2000 + parseInt(m[2], 10)
    if (mes < 1 || mes > 12) { setErro("Mês de validade inválido."); return }

    // ⚠️ Deriva apenas dados NÃO sensíveis. O número completo (digitos) e o CVV
    // permanecem só no navegador e são descartados — nunca vão ao servidor/banco.
    const ultimos4 = digitos.slice(-4)

    startSaving(async () => {
      const res = await salvarCartao({
        bandeira,
        ultimos4,
        validade_mes: mes,
        validade_ano: ano,
        nome_titular: nome,
        padrao,
      })
      if (res.error) { setErro(res.error); return }
      onDone()
    })
  }

  const field = "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-foreground">Novo cartão</h3>
        <button type="button" onClick={onCancel} aria-label="Fechar" className="text-muted-foreground hover:text-foreground">
          <X className="size-5" />
        </button>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg bg-secondary px-3 py-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        Para sua segurança, não guardamos o número completo nem o CVV. Salvamos apenas a
        bandeira, os 4 últimos dígitos e a validade para identificar o cartão.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Número do cartão</label>
          <div className="relative">
            <input
              value={numero}
              onChange={(e) => setNumero(maskCard(e.target.value))}
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              className={field}
            />
            {digitos.length >= 4 && bandeira !== "desconhecida" && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                {BANDEIRA_LABEL[bandeira]}
              </span>
            )}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Validade</label>
          <input
            value={validade}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2")
              setValidade(v)
            }}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/AA"
            className={field}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">CVV</label>
          <input
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="000"
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Nome do titular</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="cc-name"
            placeholder="Como está impresso no cartão"
            className={field}
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={padrao} onChange={(e) => setPadrao(e.target.checked)} className="size-4 rounded border-input" />
        Definir como cartão principal
      </label>

      {erro && <p className="mt-3 text-sm text-destructive">{erro}</p>}

      <div className="mt-5 flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar cartão"}</Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancelar</Button>
      </div>
    </form>
  )
}

function CartoesSection({ cartoes }: { cartoes: Cartao[] }) {
  const router = useRouter()
  const [adicionando, setAdicionando] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [, startAction] = useTransition()

  function refresh() {
    setAdicionando(false)
    router.refresh()
  }

  function handleExcluir(id: string) {
    setBusyId(id)
    startAction(async () => {
      await excluirCartao(id)
      setBusyId(null)
      router.refresh()
    })
  }

  function handlePadrao(id: string) {
    setBusyId(id)
    startAction(async () => {
      await definirCartaoPadrao(id)
      setBusyId(null)
      router.refresh()
    })
  }

  if (adicionando) {
    return <CartaoForm onDone={refresh} onCancel={() => setAdicionando(false)} />
  }

  return (
    <div className="flex flex-col gap-4">
      {cartoes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
          <CreditCard className="size-12 text-muted-foreground/40" />
          <p className="font-heading font-bold text-foreground">Nenhum cartão salvo</p>
          <p className="text-sm text-muted-foreground">Salve um cartão para agilizar suas compras.</p>
        </div>
      ) : (
        cartoes.map((c) => (
          <div key={c.id} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
            {c.padrao && (
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Star className="size-3 fill-primary" /> Principal
              </span>
            )}
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  {BANDEIRA_LABEL[c.bandeira] ?? "Cartão"} •••• {c.ultimos4}
                </p>
                <p className="text-sm text-muted-foreground">
                  {c.nome_titular} · validade {String(c.validade_mes).padStart(2, "0")}/{String(c.validade_ano).slice(-2)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {!c.padrao && (
                <button
                  onClick={() => handlePadrao(c.id)}
                  disabled={busyId === c.id}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary disabled:opacity-50"
                >
                  <Star className="size-3.5" /> Tornar principal
                </button>
              )}
              <button
                onClick={() => handleExcluir(c.id)}
                disabled={busyId === c.id}
                className="inline-flex items-center gap-1 text-xs font-medium text-destructive hover:underline disabled:opacity-50"
              >
                <Trash2 className="size-3.5" /> Remover
              </button>
            </div>
          </div>
        ))
      )}
      <button
        onClick={() => setAdicionando(true)}
        className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-4" /> Adicionar cartão
      </button>
    </div>
  )
}

/* ── Seção: Segurança ── */
function SegurancaSection() {
  const [show, setShow] = useState({ atual: false, nova: false, confirma: false })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [values, setValues] = useState({ atual: "", nova: "", confirma: "" })

  const toggle = (field: keyof typeof show) => setShow((s) => ({ ...s, [field]: !s[field] }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    if (values.nova.length < 6) { setErro("A nova senha deve ter no mínimo 6 caracteres."); return }
    if (values.nova !== values.confirma) { setErro("As senhas não coincidem."); return }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: values.nova })
    setLoading(false)
    if (error) { setErro(`Erro ao atualizar: ${error.message}`); return }
    setValues({ atual: "", nova: "", confirma: "" })
    setSaved(true)
  }

  return saved ? (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center">
      <CheckCircle2 className="size-10 text-primary" />
      <p className="font-heading font-bold text-foreground">Senha atualizada com sucesso!</p>
      <button onClick={() => setSaved(false)} className="text-sm text-primary hover:underline">Alterar novamente</button>
    </div>
  ) : (
    <form
      className="rounded-2xl border border-border bg-card p-6"
      onSubmit={handleSubmit}
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
                  required={field !== "atual"}
                  value={values[field]}
                  onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
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
      {erro && <p className="mt-3 text-sm text-destructive">{erro}</p>}
      <Button type="submit" className="mt-6" disabled={loading}>
        {loading ? "Salvando…" : "Salvar nova senha"}
      </Button>
    </form>
  )
}

/* ── Painel principal ── */
export function AccountPanel({ nome, email, telefone, cpf, pedidos, enderecos, cartoes, podeAcessarAdmin }: UserData) {
  const [active, setActive] = useState<Section>("pedidos")
  const router = useRouter()
  const activeSection = NAV.find((n) => n.id === active)!
  const user: UserData = { nome, email, telefone, cpf, pedidos, enderecos, cartoes }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const content: Record<Section, React.ReactNode> = {
    pedidos:   <PedidosSection pedidos={pedidos} />,
    dados:     <DadosSection user={user} />,
    enderecos: <EnderecosSection enderecos={enderecos} />,
    cartoes:   <CartoesSection cartoes={cartoes} />,
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
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="size-4 shrink-0" />
              Sair
            </button>
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
