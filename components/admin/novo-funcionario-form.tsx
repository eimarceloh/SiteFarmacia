"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { criarFuncionario } from "@/app/admin/equipe/actions"
import { Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"

const PAPEIS = [
  { value: "atendente",    label: "Atendente",    desc: "Vê todos os pedidos, atualiza status, cadastra/edita produtos" },
  { value: "farmaceutico", label: "Farmacêutico", desc: "Fase 2: valida receitas médicas e acompanha manipulação"        },
  { value: "manipulador",  label: "Manipulador",  desc: "Fase 2: atualiza status de manipulação no laboratório"         },
  { value: "admin",        label: "Admin",         desc: "Acesso total — pode criar/remover funcionários e acessar tudo" },
]

const inputCls =
  "h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none ring-ring focus-visible:ring-2"

export function NovoFuncionarioForm() {
  const router = useRouter()
  const [showSenha, setShowSenha] = useState(false)
  const [state, formAction, pending] = useActionState(criarFuncionario, {})

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="size-12 text-primary" />
        <p className="font-heading text-lg font-bold text-foreground">Funcionário criado!</p>
        <p className="text-sm text-muted-foreground">
          O acesso foi criado com sucesso. O funcionário já pode entrar em <strong>/admin</strong>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/equipe")}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Ver equipe
          </button>
          <button
            onClick={() => router.refresh()}
            className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Criar outro
          </button>
        </div>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
      {state.error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Nome completo *</label>
        <input name="nome" required placeholder="Ex: Maria Silva" className={inputCls} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">E-mail *</label>
        <input name="email" type="email" required placeholder="funcionario@farmacia.com" className={inputCls} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Senha provisória *</label>
        <div className="relative">
          <input
            name="senha"
            type={showSenha ? "text" : "password"}
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            className="h-11 w-full rounded-lg border border-input bg-background pl-4 pr-11 text-sm outline-none ring-ring focus-visible:ring-2"
          />
          <button
            type="button"
            onClick={() => setShowSenha((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Repasse a senha ao funcionário — ele poderá alterá-la depois em Segurança.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Papel / Acesso *</label>
        <div className="flex flex-col gap-2">
          {PAPEIS.map(({ value, label, desc }) => (
            <label
              key={value}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 hover:border-primary [&:has(input:checked)]:border-primary [&:has(input:checked)]:bg-primary/5"
            >
              <input type="radio" name="papel" value={value} required defaultChecked={value === "atendente"} className="mt-0.5 accent-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <a
          href="/admin/equipe"
          className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-center text-sm font-semibold text-foreground hover:bg-secondary"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Criar funcionário
        </button>
      </div>
    </form>
  )
}
