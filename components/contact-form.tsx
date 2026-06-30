"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Send } from "lucide-react"

const SUBJECTS = [
  "Dúvida sobre produto",
  "Envio de receita médica",
  "Rastreio de pedido",
  "Troca ou devolução",
  "Sugestões e elogios",
  "Outros",
]

function inputClass() {
  return "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
}

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="size-8 text-primary" aria-hidden="true" />
        </span>
        <h3 className="font-heading text-xl font-bold text-foreground">Mensagem enviada!</h3>
        <p className="text-sm text-muted-foreground text-pretty">
          Recebemos seu contato e responderemos em até <strong>1 dia útil</strong> no e-mail informado.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          Enviar outra mensagem
        </button>
      </div>
    )
  }

  return (
    <form
      className="rounded-2xl border border-border bg-card p-6 md:p-8"
      onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
    >
      <h2 className="mb-6 font-heading text-xl font-bold text-foreground">Envie sua mensagem</h2>
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-foreground">Nome</label>
            <input id="nome" type="text" required placeholder="Seu nome" className={inputClass()} />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
            <input id="email" type="email" required placeholder="voce@email.com" className={inputClass()} />
          </div>
        </div>

        <div>
          <label htmlFor="assunto" className="mb-1.5 block text-sm font-medium text-foreground">Assunto</label>
          <select
            id="assunto"
            required
            className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"
          >
            <option value="">Selecione o assunto</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="mensagem" className="mb-1.5 block text-sm font-medium text-foreground">Mensagem</label>
          <textarea
            id="mensagem"
            required
            rows={5}
            placeholder="Escreva sua mensagem aqui..."
            className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none ring-ring focus-visible:ring-2"
          />
        </div>

        <Button type="submit" size="lg" className="gap-2">
          <Send className="size-4" aria-hidden="true" />
          Enviar mensagem
        </Button>
      </div>
    </form>
  )
}
