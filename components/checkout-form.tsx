"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { useInventory } from "@/components/products-inventory-provider"
import { Button } from "@/components/ui/button"
import { formatBRL } from "@/lib/products"
import {
  User, Mail, Phone, MapPin, CreditCard, Lock,
  Minus, Plus, Trash2, ChevronRight, ShoppingBag,
} from "lucide-react"

const FREE_SHIPPING_THRESHOLD = 199
const SHIPPING_COST = 15.9

type PaymentTab = "cartao" | "pix"

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
]

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

export function CheckoutForm() {
  const router = useRouter()
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
  const { deductStock } = useInventory()

  const [paymentTab, setPaymentTab] = useState<PaymentTab>("cartao")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = totalPrice + shipping

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
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? "Erro ao processar pedido.")
      }

      items.forEach((item) => deductStock(item.id, item.quantity))
      clearCart()
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
                    placeholder="Como está no seu documento"
                    className={inputClass()}
                  />
                </Field>
              </div>
              <Field id="email" label="E-mail" icon={<Mail className="size-4" />}>
                <input
                  id="email" name="email" type="email" required autoComplete="email"
                  placeholder="voce@email.com"
                  className={inputClass()}
                />
              </Field>
              <Field id="telefone" label="Telefone" icon={<Phone className="size-4" />}>
                <input
                  id="telefone" name="telefone" type="tel" required autoComplete="tel"
                  placeholder="(11) 99999-9999"
                  className={inputClass()}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field id="cpf" label="CPF" icon={<Lock className="size-4" />}>
                  <input
                    id="cpf" name="cpf" type="text" required
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={inputClass()}
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Endereço */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-5 font-heading text-lg font-bold text-foreground">Endereço de entrega</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="cep" label="CEP" icon={<MapPin className="size-4" />}>
                <input
                  id="cep" name="cep" type="text" required
                  placeholder="00000-000"
                  maxLength={9}
                  className={inputClass()}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field id="logradouro" label="Rua / Avenida">
                  <input
                    id="logradouro" name="logradouro" type="text" required autoComplete="address-line1"
                    placeholder="Nome da rua"
                    className={inputClass(false)}
                  />
                </Field>
              </div>
              <Field id="numero" label="Número">
                <input
                  id="numero" name="numero" type="text" required
                  placeholder="123"
                  className={inputClass(false)}
                />
              </Field>
              <Field id="complemento" label="Complemento (opcional)">
                <input
                  id="complemento" name="complemento" type="text"
                  placeholder="Apto, bloco..."
                  className={inputClass(false)}
                />
              </Field>
              <Field id="bairro" label="Bairro">
                <input
                  id="bairro" name="bairro" type="text" required
                  placeholder="Seu bairro"
                  className={inputClass(false)}
                />
              </Field>
              <Field id="cidade" label="Cidade">
                <input
                  id="cidade" name="cidade" type="text" required autoComplete="address-level2"
                  placeholder="Sua cidade"
                  className={inputClass(false)}
                />
              </Field>
              <div>
                <label htmlFor="estado" className="mb-1.5 block text-sm font-medium text-foreground">
                  Estado
                </label>
                <select
                  id="estado" name="estado" required
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
                >
                  <option value="">Selecione</option>
                  {ESTADOS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Pagamento */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-5 font-heading text-lg font-bold text-foreground">Pagamento</h2>

            {/* Tabs */}
            <div className="mb-6 flex gap-3">
              {(["cartao", "pix"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPaymentTab(tab)}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
                    paymentTab === tab
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary"
                  }`}
                >
                  {tab === "cartao" ? "Cartão de crédito" : "PIX"}
                </button>
              ))}
            </div>

            {paymentTab === "cartao" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field id="cartaoNumero" label="Número do cartão" icon={<CreditCard className="size-4" />}>
                    <input
                      id="cartaoNumero" type="text" required
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className={inputClass()}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field id="cartaoNome" label="Nome impresso no cartão">
                    <input
                      id="cartaoNome" type="text" required
                      placeholder="Como está no cartão"
                      className={inputClass(false)}
                    />
                  </Field>
                </div>
                <Field id="validade" label="Validade">
                  <input
                    id="validade" type="text" required
                    placeholder="MM/AA"
                    maxLength={5}
                    className={inputClass(false)}
                  />
                </Field>
                <Field id="cvv" label="CVV">
                  <input
                    id="cvv" type="text" required
                    placeholder="000"
                    maxLength={4}
                    className={inputClass(false)}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <label htmlFor="parcelas" className="mb-1.5 block text-sm font-medium text-foreground">
                    Parcelas
                  </label>
                  <select
                    id="parcelas"
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
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex size-40 items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary text-muted-foreground text-xs">
                  QR Code gerado ao confirmar
                </div>
                <p className="text-sm text-muted-foreground">
                  Após confirmar, o código PIX será gerado e você terá <strong>30 minutos</strong> para pagar.
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
