"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { LogoIcon } from "@/components/logo"
import {
  Mail, Lock, User, Eye, EyeOff,
  CheckCircle2, AlertCircle, ArrowLeft, Loader2,
} from "lucide-react"

type Mode = "login" | "cadastro"

export function AuthForm({ mode }: { mode: Mode }) {
  const isLogin = mode === "login"
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/conta"

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<"login" | "cadastro" | "recuperar" | null>(null)

  // Modo esqueci a senha
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!isLogin && password !== confirmPassword) {
      setError("As senhas não coincidem. Verifique e tente novamente.")
      setLoading(false)
      return
    }

    const supabase = createClient()

    if (isLogin) {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (err) {
        setError(translateError(err.message))
        return
      }
      router.push(redirect)
      router.refresh()
    } else {
      const appUrl = window.location.origin
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nome_completo: nome },
          emailRedirectTo: `${appUrl}/auth/callback?type=signup`,
        },
      })
      setLoading(false)
      if (err) {
        setError(translateError(err.message))
        return
      }
      setSuccess("cadastro")
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setForgotLoading(true)

    const supabase = createClient()
    const appUrl = window.location.origin

    await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${appUrl}/auth/callback?next=/auth/nova-senha`,
    })

    setForgotLoading(false)
    setForgotSent(true)
  }

  // ── Tela de sucesso (cadastro / recuperação) ─────────────────────────────
  if (success === "cadastro") {
    return (
      <AuthCard>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="size-12 text-primary" />
          <h1 className="font-heading text-xl font-bold text-foreground">Conta criada!</h1>
          <p className="text-sm text-muted-foreground text-pretty">
            Enviamos um e-mail de confirmação para <strong>{email}</strong>.
          </p>
          <div className="w-full rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-left">
            <strong>Passo obrigatório:</strong> abra o e-mail e clique no link de confirmação. Só depois disso você conseguirá fazer login. Verifique também a pasta <strong>spam</strong>.
          </div>
          <Link href="/login" className={cn(buttonVariants(), "mt-2 w-full")}>
            Já confirmei — ir para o login
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>
            Voltar à loja
          </Link>
        </div>
      </AuthCard>
    )
  }

  // ── Modo: esqueci a senha ─────────────────────────────────────────────────
  if (forgotMode) {
    return (
      <AuthCard>
        {forgotSent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 className="size-12 text-primary" />
            <h1 className="font-heading text-xl font-bold text-foreground">Link enviado!</h1>
            <p className="text-sm text-muted-foreground text-pretty">
              Verifique o e-mail <strong>{forgotEmail}</strong> e siga o link para criar uma nova senha.
            </p>
            <button
              onClick={() => { setForgotMode(false); setForgotSent(false) }}
              className="mt-2 text-sm font-semibold text-primary hover:underline"
            >
              Voltar ao login
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setForgotMode(false)}
              className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Voltar
            </button>
            <div className="mb-6">
              <h1 className="font-heading text-2xl font-bold text-foreground">Recuperar senha</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe seu e-mail e enviaremos um link para criar uma nova senha.
              </p>
            </div>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
              <Field id="forgot-email" label="E-mail" icon={<Mail className="size-4" />}>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="voce@email.com"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none ring-ring focus-visible:ring-2"
                />
              </Field>
              <Button type="submit" size="lg" className="w-full" disabled={forgotLoading}>
                {forgotLoading ? <><Loader2 className="size-4 animate-spin" /> Enviando…</> : "Enviar link de recuperação"}
              </Button>
            </form>
          </>
        )}
      </AuthCard>
    )
  }

  // ── Formulário principal (login / cadastro) ───────────────────────────────
  return (
    <AuthCard>
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLogin
            ? "Entre para acompanhar seus pedidos e fórmulas."
            : "Cadastre-se para comprar com mais agilidade."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <Field id="nome" label="Nome completo" icon={<User className="size-4" />}>
            <input
              id="nome"
              type="text"
              required
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none ring-ring focus-visible:ring-2"
            />
          </Field>
        )}

        <Field id="email" label="E-mail" icon={<Mail className="size-4" />}>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
            className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none ring-ring focus-visible:ring-2"
          />
        </Field>

        <Field id="password" label="Senha" icon={<Lock className="size-4" />}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-11 text-sm outline-none ring-ring focus-visible:ring-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </Field>

        {!isLogin && (
          <Field id="confirm-password" label="Confirmar senha" icon={<Lock className="size-4" />}>
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-11 text-sm outline-none ring-ring focus-visible:ring-2"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
            {confirmPassword && password !== confirmPassword && (
              <span className="absolute -bottom-5 left-0 text-xs text-destructive">
                As senhas não coincidem
              </span>
            )}
          </Field>
        )}

        {isLogin && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setForgotMode(true)}
              className="text-sm font-medium text-primary hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading
            ? <><Loader2 className="size-4 animate-spin" /> {isLogin ? "Entrando…" : "Criando conta…"}</>
            : isLogin ? "Entrar" : "Criar conta"
          }
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? (
          <>
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-semibold text-primary hover:underline">
              Cadastre-se
            </Link>
          </>
        ) : (
          <>
            Já tem conta?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Entrar
            </Link>
          </>
        )}
      </p>
    </AuthCard>
  )
}

// ── Layout compartilhado ─────────────────────────────────────────────────────

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-secondary">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2" aria-label="Farmácia do Povo, página inicial">
            <LogoIcon className="size-10 shrink-0" />
            <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
              Farmácia do Pov<span className="text-primary">+</span>
            </span>
          </Link>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
            {children}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground text-pretty">
            Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade da Farmácia do Povo.
          </p>
        </div>
      </div>
    </main>
  )
}

// ── Tradução de erros do Supabase ────────────────────────────────────────────

function translateError(msg: string): string {
  if (msg.includes("Invalid login credentials")) {
    return "E-mail ou senha incorretos. Se você acabou de se cadastrar, confirme seu e-mail antes de entrar (verifique a caixa de entrada e a pasta spam)."
  }
  if (msg.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada."
  if (msg.includes("User already registered")) return "Este e-mail já está cadastrado. Tente fazer login."
  if (msg.includes("Password should be at least")) return "A senha deve ter no mínimo 6 caracteres."
  if (msg.includes("rate limit")) return "Muitas tentativas. Aguarde um momento e tente novamente."
  if (
    msg.includes("fetch") ||
    msg.includes("network") ||
    msg.includes("Load failed") ||
    msg.includes("Failed to fetch") ||
    msg.includes("NetworkError")
  ) {
    return "Erro de conexão com o servidor. Verifique se o Supabase está configurado corretamente no .env.local."
  }
  return `Ocorreu um erro inesperado: ${msg}`
}

// ── Field helper ─────────────────────────────────────────────────────────────

function Field({
  id, label, icon, children,
}: {
  id: string; label: string; icon: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-muted-foreground">{icon}</span>
        {children}
      </div>
    </div>
  )
}
