import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { usuarioTemPermissao } from "@/lib/rbac/verificar"
import { NovoFuncionarioForm } from "@/components/admin/novo-funcionario-form"

export const metadata: Metadata = { title: "Novo funcionário" }

export default async function NovoFuncionarioPage() {
  const ehAdmin = await usuarioTemPermissao("usuario.gerenciar")
  if (!ehAdmin) redirect("/acesso-negado")

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold text-foreground">Novo funcionário</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          O acesso é criado imediatamente — o funcionário já pode entrar com o e-mail e senha informados.
        </p>
      </div>
      <NovoFuncionarioForm />
    </div>
  )
}
