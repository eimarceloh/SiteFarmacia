"use client"

// PermissoesProvider — carrega as permissões do usuário logado e as disponibiliza
// via usePermissoes() para qualquer componente adaptar sua interface.
//
// Uso:
//   const { temPermissao } = usePermissoes()
//   if (temPermissao("produto.criar")) { ... }
//
// Importante: isso é apenas para UX (mostrar/esconder botões).
// A autorização real sempre ocorre no backend (verificar.ts).

import {
  createContext, useContext, useEffect, useState, useCallback,
} from "react"
import { useAuth } from "@/components/auth-provider"
import type { PermissaoChave } from "@/lib/rbac/tipos"

type PermissoesContextType = {
  permissoes: string[]
  temPermissao: (chave: PermissaoChave | string) => boolean
  carregando: boolean
}

const PermissoesContext = createContext<PermissoesContextType>({
  permissoes: [],
  temPermissao: () => false,
  carregando: true,
})

export function PermissoesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [permissoes, setPermissoes] = useState<string[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!user) {
      setPermissoes([])
      setCarregando(false)
      return
    }

    setCarregando(true)
    fetch("/api/auth/permissoes")
      .then((r) => r.json())
      .then((d) => setPermissoes(d.permissoes ?? []))
      .catch(() => setPermissoes([]))
      .finally(() => setCarregando(false))
  }, [user?.id])  // re-busca somente quando o usuário muda

  const temPermissao = useCallback(
    (chave: PermissaoChave | string) => permissoes.includes(chave),
    [permissoes],
  )

  return (
    <PermissoesContext.Provider value={{ permissoes, temPermissao, carregando }}>
      {children}
    </PermissoesContext.Provider>
  )
}

export function usePermissoes() {
  return useContext(PermissoesContext)
}
