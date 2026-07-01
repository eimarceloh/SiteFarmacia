import Link from "next/link"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { usuarioTemPermissao } from "@/lib/rbac/verificar"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { Plus, UserCheck, UserX } from "lucide-react"

export const metadata: Metadata = { title: "Equipe" }

const PAPEL_BADGE: Record<string, string> = {
  admin:        "bg-red-100 text-red-700 border-red-200",
  atendente:    "bg-blue-100 text-blue-700 border-blue-200",
  farmaceutico: "bg-violet-100 text-violet-700 border-violet-200",
  manipulador:  "bg-amber-100 text-amber-700 border-amber-200",
  cliente:      "bg-gray-100 text-gray-600 border-gray-200",
}

export default async function EquipePage() {
  const ehAdmin = await usuarioTemPermissao("usuario.gerenciar")
  if (!ehAdmin) redirect("/acesso-negado")

  // Usa service role para ver todos os clientes que têm papel_id definido
  const { data: funcionarios } = await supabaseAdmin
    .from("clientes")
    .select("id, nome_completo, email, ativo, criado_em, perfis(nome)")
    .not("papel_id", "is", null)
    .order("criado_em", { ascending: false })

  // Filtra somente non-clientes
  const lista = (funcionarios ?? []).filter(
    (f) => (f.perfis as { nome: string } | null)?.nome !== "cliente",
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground md:text-3xl">Equipe</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie funcionários, atendentes e administradores
          </p>
        </div>
        <Link
          href="/admin/equipe/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="size-4" />
          Novo funcionário
        </Link>
      </div>

      {lista.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-20 text-center">
          <UserCheck className="size-12 text-muted-foreground/40" />
          <p className="font-heading font-bold text-foreground">Nenhum funcionário cadastrado</p>
          <p className="text-sm text-muted-foreground">Crie o primeiro membro da equipe.</p>
          <Link href="/admin/equipe/novo" className="mt-2 text-sm font-semibold text-primary hover:underline">
            Adicionar funcionário
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3">Nome</th>
                  <th className="px-5 py-3">E-mail</th>
                  <th className="px-5 py-3">Papel</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Desde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lista.map((f) => {
                  const papel = (f.perfis as { nome: string } | null)?.nome ?? "—"
                  const badgeCls = PAPEL_BADGE[papel] ?? PAPEL_BADGE.cliente
                  return (
                    <tr key={f.id} className="hover:bg-secondary/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
                            {(f.nome_completo ?? f.email ?? "?").charAt(0).toUpperCase()}
                          </span>
                          <p className="font-medium text-foreground">{f.nome_completo ?? "—"}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{f.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${badgeCls}`}>
                          {papel}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {f.ativo ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                            <UserCheck className="size-3.5" /> Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                            <UserX className="size-3.5" /> Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(f.criado_em).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
            {lista.length} membro{lista.length !== 1 ? "s" : ""} da equipe
          </div>
        </div>
      )}
    </div>
  )
}
