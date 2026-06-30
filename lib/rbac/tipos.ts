// Chaves de permissão — espelham exatamente a coluna permissoes.nome no banco.
// Para adicionar permissão: INSERT no banco + adicionar entrada aqui.
// NUNCA renomeie uma chave existente — crie uma nova e deprecie a antiga.

export const PERMISSOES = {
  // Catálogo
  PRODUTO_VER:             "produto.ver",
  PRODUTO_CRIAR:           "produto.criar",
  PRODUTO_EDITAR:          "produto.editar",
  PRODUTO_REMOVER:         "produto.remover",
  // Estoque
  ESTOQUE_VER:             "estoque.ver",
  ESTOQUE_GERENCIAR:       "estoque.gerenciar",
  // Pedidos
  PEDIDO_CRIAR:            "pedido.criar",
  PEDIDO_VER_PROPRIOS:     "pedido.ver_proprios",
  PEDIDO_VER_TODOS:        "pedido.ver_todos",
  PEDIDO_ATUALIZAR_STATUS: "pedido.atualizar_status",
  PEDIDO_CANCELAR:         "pedido.cancelar",
  // Clientes
  CLIENTE_VER:             "cliente.ver",
  CLIENTE_EDITAR:          "cliente.editar",
  // Perfil próprio
  PERFIL_VER_PROPRIO:      "perfil.ver_proprio",
  PERFIL_EDITAR_PROPRIO:   "perfil.editar_proprio",
  // Relatórios / Admin
  RELATORIO_VER:           "relatorio.ver",
  USUARIO_GERENCIAR:       "usuario.gerenciar",
  CONFIG_GERENCIAR:        "config.gerenciar",
  // Fase 2 — definidas agora; sem atribuição de papel ainda
  RECEITA_VER:             "receita.ver",
  RECEITA_VALIDAR:         "receita.validar",
  MANIPULACAO_VER:         "manipulacao.ver",
  MANIPULACAO_ATUALIZAR:   "manipulacao.atualizar",
} as const

export type PermissaoChave = (typeof PERMISSOES)[keyof typeof PERMISSOES]

// Papéis existentes no banco (informativo — não use para lógica de acesso)
export type NomePapel =
  | "cliente"
  | "atendente"
  | "admin"
  | "farmaceutico"   // fase 2
  | "manipulador"    // fase 2
