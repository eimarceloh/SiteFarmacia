// Exemplo de rotas de API protegidas por permissão granular.
// Padrão: verificarAuth(chave) → { user, autorizado } → 401/403 se negado.
// A lógica real de DB substituiria os TODO abaixo.

import { NextResponse } from "next/server"
import { verificarAuth } from "@/lib/rbac/verificar"

// POST /api/admin/produtos — cria produto (exige produto.criar)
export async function POST(request: Request) {
  const { user, autorizado } = await verificarAuth("produto.criar")

  if (!user) {
    return NextResponse.json(
      { erro: "Não autenticado. Faça login para continuar." },
      { status: 401 },
    )
  }
  if (!autorizado) {
    return NextResponse.json(
      { erro: "Acesso negado.", detalhe: "Permissão necessária: produto.criar" },
      { status: 403 },
    )
  }

  const body = await request.json().catch(() => ({}))
  // TODO: validar body com zod e inserir via supabaseAdmin
  return NextResponse.json({ mensagem: "Produto criado.", dados: body }, { status: 201 })
}

// DELETE /api/admin/produtos?id=uuid — remove produto (exige produto.remover)
export async function DELETE(request: Request) {
  const { user, autorizado } = await verificarAuth("produto.remover")

  if (!user) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 })
  }
  if (!autorizado) {
    return NextResponse.json(
      { erro: "Acesso negado.", detalhe: "Permissão necessária: produto.remover" },
      { status: 403 },
    )
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) {
    return NextResponse.json({ erro: "Parâmetro 'id' ausente." }, { status: 400 })
  }

  // TODO: remover via supabaseAdmin
  return NextResponse.json({ mensagem: `Produto ${id} removido.` })
}

// PATCH /api/admin/produtos?id=uuid — edita produto (exige produto.editar)
export async function PATCH(request: Request) {
  const { user, autorizado } = await verificarAuth("produto.editar")

  if (!user) return NextResponse.json({ erro: "Não autenticado." }, { status: 401 })
  if (!autorizado) {
    return NextResponse.json(
      { erro: "Acesso negado.", detalhe: "Permissão necessária: produto.editar" },
      { status: 403 },
    )
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const body = await request.json().catch(() => ({}))

  // TODO: atualizar via supabaseAdmin
  return NextResponse.json({ mensagem: `Produto ${id} atualizado.`, dados: body })
}
