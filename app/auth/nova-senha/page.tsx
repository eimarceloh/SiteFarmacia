"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { FlaskConical, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"
import { LogoIcon } from "@/components/logo"

export default function NovaSenhaPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.")
      return
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) {
      setError("Não foi possível atualizar a senha. O link pode ter expirado.")
      return
    }

    setDone(true)
    setTimeout(() => router.push("/conta"), 2000)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <LogoIcon className="size-10 shrink-0" />
          <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Farmácia do Povo
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="size-12 text-primary" />
              <h1 className="font-heading text-xl font-bold">Senha atualizada!</h1>
              <p className="text-sm text-muted-foreground">Redirecionando para sua conta…</p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h1 className="font-heading text-2xl font-bold text-foreground">Nova senha</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Escolha uma senha segura com pelo menos 6 caracteres.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                    Nova senha
                  </label>
                  <div className="relative flex items-center">
                    <span className="pointer-events-none absolute left-3 text-muted-foreground">
                      <Lock className="size-4" />
                    </span>
                    <input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-11 text-sm outline-none ring-ring focus-visible:ring-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">
                    Confirmar senha
                  </label>
                  <div className="relative flex items-center">
                    <span className="pointer-events-none absolute left-3 text-muted-foreground">
                      <Lock className="size-4" />
                    </span>
                    <input
                      id="confirm"
                      type={showPwd ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none ring-ring focus-visible:ring-2"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                    <AlertCircle className="size-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
                  {loading ? "Salvando…" : "Salvar nova senha"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
