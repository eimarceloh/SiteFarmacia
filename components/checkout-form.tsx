"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { useInventory } from "@/components/products-inventory-provider"
import { Button } from "@/components/ui/button"
import { formatBRL } from "@/lib/products"
import { tokenizarCartao } from "@/lib/pagarme/tokenize"
import {
  User, Mail, Phone, MapPin, CreditCard, Lock,
  Minus, Plus, Trash2, ChevronRight, ShoppingBag, Check, Loader2,
  QrCode, Barcode, Copy, CheckCircle2, ExternalLink,
} from "lucide-react"

const FREE_SHIPPING_THRESHOLD = 199
const SHIPPING_COST = 15.9

type PaymentTab = "cartao" | "pix" | "boleto"

type PagamentoResultado = {
  numeroPedido: string
  total: number
  metodo: string
  pix?: { qrCode: string; qrCodeUrl: string } | null
  boleto?: { url: string; linhaDigitavel: string } | null
}

export type CheckoutInitial = {
  nome: string
  email: string
  telefone: string
  cpf: string
}

export type SavedAddress = {
  id: string
  rotulo: string
  cep: string
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  cidade: string
  estado: string
  padrao: boolean
}

function maskCep(v: string) {
  return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2")
}

/* ── Seletor de endereço (estilo Mercado Livre) ── */
function AddressPicker({ addresses }: { addresses: SavedAddress[] }) {
  const hasSaved = addresses.length > 0
  const defaultId = addresses.find((a) => a.padrao)?.id ?? addresses[0]?.id ?? "new"
  const [selected, setSelected] = useState<string>(hasSaved ? defaultId : "new")

  const chosen = addresses.find((a) => a.id === selected)
  const showForm = selected === "new"

  // Campos do "novo endereço" (com autopreenchimento por CEP)
  const [form, setForm] = useState({
    cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "",
  })
  const [cepLoading, setCepLoading] = useState(false)
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

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
      // sem conexão com ViaCEP — preenchimento manual
    } finally {
      setCepLoading(false)
    }
  }

  const field = (hasIcon = false) =>
    `h-11 w-full rounded-lg border border-input bg-background ${hasIcon ? "pl-10" : "pl-4"} pr-4 text-sm outline-none ring-ring focus-visible:ring-2`

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-5 font-heading text-lg font-bold text-foreground">Endereço de entrega</h2>

      {hasSaved && (
        <div className="mb-5 flex flex-col gap-3">
          {addresses.map((a) => {
            const active = selected === a.id
            return (
              <label
                key={a.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="radio" name="__addr_choice" checked={active}
                  onChange={() => setSelected(a.id)}
                  className="mt-1 size-4 accent-[var(--primary)]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{a.rotulo}</span>
                    {a.padrao && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Principal</span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {a.logradouro}, {a.numero}{a.complemento ? ` — ${a.complemento}` : ""} · {a.bairro}, {a.cidade}/{a.estado} · CEP {maskCep(a.cep)}
                  </p>
                </div>
                {active && <Check className="mt-0.5 size-5 shrink-0 text-primary" />}
              </label>
            )
          })}

          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-4 text-sm font-semibold transition-colors ${
              showForm ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            <input
              type="radio" name="__addr_choice" checked={showForm}
              onChange={() => setSelected("new")}
              className="size-4 accent-[var(--primary)]"
            />
            <Plus className="size-4" /> Usar outro endereço
          </label>
        </div>
      )}

      {/* Endereço escolhido salvo → envia via inputs ocultos */}
      {chosen && !showForm && (
        <>
          <input type="hidden" name="cep" value={chosen.cep} />
          <input type="hidden" name="logradouro" value={chosen.logradouro} />
          <input type="hidden" name="numero" value={chosen.numero} />
          <input type="hidden" name="complemento" value={chosen.complemento ?? ""} />
          <input type="hidden" name="bairro" value={chosen.bairro} />
          <input type="hidden" name="cidade" value={chosen.cidade} />
          <input type="hidden" name="estado" value={chosen.estado} />
        </>
      )}

      {/* Novo endereço → formulário editável */}
      {showForm && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="cep" label="CEP" icon={<MapPin className="size-4" />}>
            <div className="relative w-full">
              <input
                id="cep" name="cep" type="text" required
                value={form.cep}
                onChange={(e) => set({ cep: maskCep(e.target.value) })}
                onBlur={(e) => buscarCep(e.target.value)}
                placeholder="00000-000" maxLength={9}
                className={field(true)}
              />
              {cepLoading && <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
            </div>
          </Field>
          <div className="sm:col-span-2">
            <Field id="logradouro" label="Rua / Avenida">
              <input
                id="logradouro" name="logradouro" type="text" required autoComplete="address-line1"
                value={form.logradouro} onChange={(e) => set({ logradouro: e.target.value })}
                placeholder="Nome da rua" className={field()}
              />
            </Field>
          </div>
          <Field id="numero" label="Número">
            <input
              id="numero" name="numero" type="text" required
              value={form.numero} onChange={(e) => set({ numero: e.target.value })}
              placeholder="123" className={field()}
            />
          </Field>
          <Field id="complemento" label="Complemento (opcional)">
            <input
              id="complemento" name="complemento" type="text"
              value={form.complemento} onChange={(e) => set({ complemento: e.target.value })}
              placeholder="Apto, bloco..." className={field()}
            />
          </Field>
          <Field id="bairro" label="Bairro">
            <input
              id="bairro" name="bairro" type="text" required
              value={form.bairro} onChange={(e) => set({ bairro: e.target.value })}
              placeholder="Seu bairro" className={field()}
            />
          </Field>
          <Field id="cidade" label="Cidade">
            <input
              id="cidade" name="cidade" type="text" required autoComplete="address-level2"
              value={form.cidade} onChange={(e) => set({ cidade: e.target.value })}
              placeholder="Sua cidade" className={field()}
            />
          </Field>
          <div>
            <label htmlFor="estado" className="mb-1.5 block text-sm font-medium text-foreground">Estado</label>
            <select
              id="estado" name="estado" required
              value={form.estado} onChange={(e) => set({ estado: e.target.value })}
              className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
            >
              <option value="">Selecione</option>
              {ESTADOS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
            </select>
          </div>
        </div>
      )}
    </section>
  )
}

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
]

/* ── Painel de resultado PIX / boleto ── */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [copiado, setCopiado] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); setCopiado(true); setTimeout(() => setCopiado(false), 2000) } catch {}
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
    >
      {copiado ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
      {copiado ? "Copiado!" : label}
    </button>
  )
}

function PagamentoResultadoPanel({ resultado }: { resultado: PagamentoResultado }) {
  const { numeroPedido, total, pix, boleto } = resultado

  return (
    <div className="mx-auto max-w-lg px-4 py-10 md:py-16">
      <div className="rounded-2xl border border-border bg-card p-6 text-center md:p-8">
        <CheckCircle2 className="mx-auto size-12 text-primary" />
        <h1 className="mt-3 font-heading text-2xl font-extrabold text-foreground">Pedido recebido!</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pedido <strong className="text-foreground">{numeroPedido}</strong> · R$ {formatBRL(total)}
        </p>

        {pix && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-foreground">Pague com PIX para confirmar</p>
            {pix.qrCodeUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pix.qrCodeUrl} alt="QR Code PIX" className="size-52 rounded-xl border border-border" />
            )}
            {pix.qrCode && (
              <div className="w-full">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">PIX copia e cola</p>
                <p className="mb-2 break-all rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">{pix.qrCode}</p>
                <CopyButton value={pix.qrCode} label="Copiar código" />
              </div>
            )}
            <p className="text-xs text-muted-foreground">Válido por 1 hora. A confirmação é automática após o pagamento.</p>
          </div>
        )}

        {boleto && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-foreground">Seu boleto foi gerado</p>
            {boleto.url && (
              <a
                href={boleto.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                <ExternalLink className="size-4" /> Abrir boleto
              </a>
            )}
            {boleto.linhaDigitavel && (
              <div className="w-full">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Linha digitável</p>
                <p className="mb-2 break-all rounded-lg bg-secondary px-3 py-2 text-xs text-muted-foreground">{boleto.linhaDigitavel}</p>
                <CopyButton value={boleto.linhaDigitavel} label="Copiar linha digitável" />
              </div>
            )}
            <p className="text-xs text-muted-foreground">Vence em 3 dias. A compensação leva até 2 dias úteis.</p>
          </div>
        )}

        <p className="mt-6 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
          Assim que o pagamento for confirmado, avisaremos por e-mail e o pedido entra em preparação.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/conta" className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:opacity-90">
            Ver meus pedidos
          </Link>
          <Link href="/" className="flex-1 rounded-lg border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground hover:bg-secondary">
            Voltar à loja
          </Link>
        </div>
      </div>
    </div>
  )
}

function Field({
  id, label, icon, children,
}: {
  id: string; label: string; icon?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3 text-muted-foreground">{icon}</span>
        )}
        {children}
      </div>
    </div>
  )
}

const inputClass = (hasIcon = true) =>
  `h-11 w-full rounded-lg border border-input bg-background ${hasIcon ? "pl-10" : "pl-4"} pr-4 text-sm outline-none ring-ring focus-visible:ring-2`

export function CheckoutForm({ initial, addresses = [] }: { initial?: CheckoutInitial; addresses?: SavedAddress[] }) {
  const router = useRouter()
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
  const { deductStock } = useInventory()

  const [paymentTab, setPaymentTab] = useState<PaymentTab>("cartao")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [resultado, setResultado] = useState<PagamentoResultado | null>(null)

  // Campos do cartão (controlados; tokenizados no navegador, nunca vão ao backend)
  const [cardNumero, setCardNumero] = useState("")
  const [cardNome, setCardNome] = useState("")
  const [cardValidade, setCardValidade] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [parcelas, setParcelas] = useState(1)

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = totalPrice + shipping

  // Pagamento PIX/boleto gerado → mostra as instruções (tem prioridade sobre o carrinho vazio)
  if (resultado) {
    return <PagamentoResultadoPanel resultado={resultado} />
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <ShoppingBag className="size-14 text-muted-foreground/40" />
        <p className="font-heading text-xl font-bold text-foreground">Seu carrinho está vazio</p>
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          Voltar à loja
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    const fd = new FormData(e.currentTarget)
    const get = (key: string) => (fd.get(key) as string) ?? ""

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        nome: get("nome"),
        email: get("email"),
        telefone: get("telefone"),
        cpf: get("cpf"),
        cep: get("cep"),
        logradouro: get("logradouro"),
        numero: get("numero"),
        complemento: get("complemento"),
        bairro: get("bairro"),
        cidade: get("cidade"),
        estado: get("estado"),
        forma_pagamento: paymentTab,
        items: items.map((item) => ({
          id: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image,
        })),
      }

      // Cartão: tokeniza no navegador (PAN/CVV nunca vão ao nosso servidor)
      if (paymentTab === "cartao") {
        const m = cardValidade.match(/^(\d{2})\/(\d{2})$/)
        if (!m) throw new Error("Validade do cartão no formato MM/AA.")
        const token = await tokenizarCartao({
          numero: cardNumero,
          nomeTitular: cardNome,
          mes: parseInt(m[1], 10),
          ano: 2000 + parseInt(m[2], 10),
          cvv: cardCvv,
        })
        payload.card_token = token
        payload.parcelas = parcelas
      }

      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erro ao processar pedido.")

      items.forEach((item) => deductStock(item.id, item.quantity))
      clearCart()

      // PIX / boleto → mostra QR / boleto (pagamento assíncrono)
      if (data.pix || data.boleto) {
        setResultado({
          numeroPedido: data.numeroPedido,
          total: data.total,
          metodo: data.metodo ?? paymentTab,
          pix: data.pix,
          boleto: data.boleto,
        })
        setSubmitting(false)
        return
      }

      // Cartão aprovado (ou sem gateway) → confirmação
      router.push(`/pedido/confirmado?pedido=${data.numeroPedido}&total=${data.total.toFixed(2)}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Ocorreu um erro. Tente novamente.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:py-12 lg:grid-cols-[1fr_380px]">

        {/* ── Esquerda: formulário ── */}
        <div className="flex flex-col gap-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Etapas">
            <Link href="/" className="hover:text-foreground">Loja</Link>
            <ChevronRight className="size-4" />
            <Link href="/produtos" className="hover:text-foreground">Produtos</Link>
            <ChevronRight className="size-4" />
            <span className="font-medium text-foreground">Checkout</span>
          </nav>

          {/* Dados pessoais */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-5 font-heading text-lg font-bold text-foreground">Seus dados</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field id="nome" label="Nome completo" icon={<User className="size-4" />}>
                  <input
                    id="nome" name="nome" type="text" required autoComplete="name"
                    defaultValue={initial?.nome}
                    placeholder="Como está no seu documento"
                    className={inputClass()}
                  />
                </Field>
              </div>
              <Field id="email" label="E-mail" icon={<Mail className="size-4" />}>
                <input
                  id="email" name="email" type="email" required autoComplete="email"
                  defaultValue={initial?.email}
                  placeholder="voce@email.com"
                  className={inputClass()}
                />
              </Field>
              <Field id="telefone" label="Telefone" icon={<Phone className="size-4" />}>
                <input
                  id="telefone" name="telefone" type="tel" required autoComplete="tel"
                  defaultValue={initial?.telefone}
                  placeholder="(11) 99999-9999"
                  className={inputClass()}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field id="cpf" label="CPF" icon={<Lock className="size-4" />}>
                  <input
                    id="cpf" name="cpf" type="text" required
                    defaultValue={initial?.cpf}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={inputClass()}
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Endereço */}
          <AddressPicker addresses={addresses} />

          {/* Pagamento */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-5 font-heading text-lg font-bold text-foreground">Pagamento</h2>

            {/* Tabs */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              {([
                { id: "cartao", label: "Cartão", icon: CreditCard },
                { id: "pix",    label: "PIX",    icon: QrCode     },
                { id: "boleto", label: "Boleto", icon: Barcode    },
              ] as const).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentTab(id)}
                  className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                    paymentTab === id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary"
                  }`}
                >
                  <Icon className="size-4" /> {label}
                </button>
              ))}
            </div>

            {paymentTab === "cartao" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field id="cartaoNumero" label="Número do cartão" icon={<CreditCard className="size-4" />}>
                    <input
                      id="cartaoNumero" type="text" inputMode="numeric" autoComplete="cc-number"
                      value={cardNumero}
                      onChange={(e) => setCardNumero(e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ").trim())}
                      placeholder="0000 0000 0000 0000"
                      className={inputClass()}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field id="cartaoNome" label="Nome impresso no cartão">
                    <input
                      id="cartaoNome" type="text" autoComplete="cc-name"
                      value={cardNome}
                      onChange={(e) => setCardNome(e.target.value)}
                      placeholder="Como está no cartão"
                      className={inputClass(false)}
                    />
                  </Field>
                </div>
                <Field id="validade" label="Validade">
                  <input
                    id="validade" type="text" inputMode="numeric" autoComplete="cc-exp"
                    value={cardValidade}
                    onChange={(e) => setCardValidade(e.target.value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2"))}
                    placeholder="MM/AA"
                    className={inputClass(false)}
                  />
                </Field>
                <Field id="cvv" label="CVV">
                  <input
                    id="cvv" type="text" inputMode="numeric" autoComplete="cc-csc"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="000"
                    className={inputClass(false)}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <label htmlFor="parcelas" className="mb-1.5 block text-sm font-medium text-foreground">
                    Parcelas
                  </label>
                  <select
                    id="parcelas"
                    value={parcelas}
                    onChange={(e) => setParcelas(Number(e.target.value))}
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
                  >
                    {[1, 2, 3, 4, 6, 12].map((n) => (
                      <option key={n} value={n}>
                        {n}x de R$ {formatBRL(total / n)}{n <= 3 ? " (sem juros)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {paymentTab === "pix" && (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <QrCode className="size-12 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Ao confirmar, geramos o <strong>QR Code PIX</strong>. Você terá até <strong>1 hora</strong> para pagar.
                </p>
                <p className="text-sm font-medium text-foreground">
                  Total: <span className="text-primary">R$ {formatBRL(total)}</span>
                </p>
              </div>
            )}

            {paymentTab === "boleto" && (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <Barcode className="size-12 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Ao confirmar, geramos o <strong>boleto</strong> com vencimento em <strong>3 dias</strong>.
                  A compensação leva até 2 dias úteis após o pagamento.
                </p>
                <p className="text-sm font-medium text-foreground">
                  Total: <span className="text-primary">R$ {formatBRL(total)}</span>
                </p>
              </div>
            )}
          </section>
        </div>

        {/* ── Direita: resumo do pedido ── */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-5 font-heading text-lg font-bold text-foreground">Resumo do pedido</h2>

            <ul className="mb-5 divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <div className="size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-secondary">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-semibold leading-snug text-foreground">{item.name}</p>
                    <p className="text-sm font-bold text-foreground">R$ {formatBRL(item.price)}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex size-6 items-center justify-center rounded-full text-foreground hover:bg-secondary"
                          aria-label="Diminuir"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex size-6 items-center justify-center rounded-full text-foreground hover:bg-secondary"
                          aria-label="Aumentar"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Remover ${item.name}`}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {formatBRL(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Frete</span>
                {shipping === 0
                  ? <span className="font-medium text-primary">Grátis</span>
                  : <span>R$ {formatBRL(shipping)}</span>
                }
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Faltam R$ {formatBRL(FREE_SHIPPING_THRESHOLD - totalPrice)} para frete grátis
                </p>
              )}
              <div className="flex justify-between border-t border-border pt-3 font-heading text-base font-extrabold text-foreground">
                <span>Total</span>
                <span>R$ {formatBRL(total)}</span>
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-6 w-full gap-2" disabled={submitting}>
              <Lock className="size-4" aria-hidden="true" />
              {submitting ? "Processando..." : "Confirmar pedido"}
            </Button>

            {submitError && (
              <p className="mt-3 rounded-lg bg-destructive/10 px-4 py-2.5 text-center text-sm text-destructive">
                {submitError}
              </p>
            )}

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Pagamento seguro com criptografia SSL
            </p>
          </div>
        </div>

      </div>
    </form>
  )
}
