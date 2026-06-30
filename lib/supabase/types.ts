// Gerado manualmente com base em supabase/migrations/001_schema.sql
// Para regenerar automaticamente: npx supabase gen types typescript --linked

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

// ── Row types (resultado de SELECT — campos em português, igual ao banco) ─────

export interface CategoryRow {
  id: string
  slug: string
  titulo: string
  descricao: string | null
  descricao_longa: string | null
  icone: string | null
  ordem: number
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface ProductRow {
  id: string
  slug: string
  nome: string
  tag: string
  categoria_id: string | null
  url_imagem: string | null
  descricao: string
  beneficios: string[]
  ingredientes: string
  modo_de_uso: string
  preco_original: number | null
  preco_base: number
  preco_campanha: number | null
  label_campanha: string | null
  estoque: number
  ativo: boolean
  ordem: number
  media_avaliacao: number
  total_avaliacoes: number
  criado_em: string
  atualizado_em: string
}

export interface ProductReviewRow {
  id: string
  produto_id: string
  cliente_id: string | null
  nome_autor: string
  nota: number
  comentario: string | null
  compra_verificada: boolean
  aprovado: boolean
  criado_em: string
}

export interface CustomerRow {
  id: string
  nome_completo: string | null
  cpf: string | null
  telefone: string | null
  email: string | null
  papel_id: string | null   // FK → perfis.id (substituiu o campo perfil TEXT)
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface AddressRow {
  id: string
  cliente_id: string
  rotulo: string
  logradouro: string
  numero: string
  complemento: string | null
  bairro: string
  cidade: string
  estado: string
  cep: string
  padrao: boolean
  criado_em: string
}

export interface OrderRow {
  id: string
  numero_pedido: string
  cliente_id: string | null
  nome_cliente: string
  email_cliente: string
  telefone_cliente: string | null
  cpf_cliente: string | null
  entrega_logradouro: string | null
  entrega_numero: string | null
  entrega_complemento: string | null
  entrega_bairro: string | null
  entrega_cidade: string | null
  entrega_estado: string | null
  entrega_cep: string | null
  forma_pagamento: string
  status_pagamento: string
  status: string
  subtotal: number
  frete: number
  total_desconto: number
  total: number
  codigo_rastreio: string | null
  previsao_entrega: string | null
  observacoes: string | null
  criado_em: string
  atualizado_em: string
}

export interface OrderItemRow {
  id: string
  pedido_id: string
  produto_id: string | null
  nome_produto: string
  imagem_produto: string | null
  slug_produto: string | null
  quantidade: number
  preco_unitario: number
  preco_total: number
}

export interface OrderStatusHistoryRow {
  id: string
  pedido_id: string
  status: string
  rotulo: string
  observacao: string | null
  criado_por: string | null
  criado_em: string
}

export interface PrescriptionRow {
  id: string
  cliente_id: string | null
  pedido_id: string | null
  nome_medico: string | null
  crm: string | null
  uf_crm: string | null
  data_receita: string | null
  url_arquivo: string | null
  nome_arquivo: string | null
  observacoes: string | null
  status: string
  revisado_por: string | null
  revisado_em: string | null
  motivo_rejeicao: string | null
  criado_em: string
  atualizado_em: string
}

export interface NewsletterRow {
  id: string
  email: string
  nome: string | null
  ativo: boolean
  origem: string | null
  inscrito_em: string
  cancelado_em: string | null
}

export interface ContactMessageRow {
  id: string
  nome: string
  email: string
  telefone: string | null
  assunto: string
  mensagem: string
  status: string
  respondido_por: string | null
  respondido_em: string | null
  texto_resposta: string | null
  criado_em: string
}

export interface RoleRow {
  id: string
  nome: string
  descricao: string | null
  criado_em: string
}

export interface PermissionRow {
  id: string
  nome: string
  descricao: string | null
  recurso: string
  acao: string
}

// ── Database type (estrutura exigida pelo @supabase/supabase-js v2) ───────────

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: CategoryRow
        Insert: {
          id?: string; slug: string; titulo: string
          descricao?: string | null; descricao_longa?: string | null; icone?: string | null
          ordem?: number; ativo?: boolean
          criado_em?: string; atualizado_em?: string
        }
        Update: Partial<CategoryRow>
        Relationships: []
      }
      produtos: {
        Row: ProductRow
        Insert: {
          id?: string; slug: string; nome: string; tag: string
          categoria_id?: string | null; url_imagem?: string | null
          descricao?: string; beneficios?: string[]
          ingredientes?: string; modo_de_uso?: string
          preco_original?: number | null; preco_base: number
          preco_campanha?: number | null; label_campanha?: string | null
          estoque?: number; ativo?: boolean; ordem?: number
          media_avaliacao?: number; total_avaliacoes?: number
          criado_em?: string; atualizado_em?: string
        }
        Update: Partial<ProductRow>
        Relationships: [{ foreignKeyName: "produtos_categoria_id_fkey"; columns: ["categoria_id"]; isOneToOne: false; referencedRelation: "categorias"; referencedColumns: ["id"] }]
      }
      avaliacoes: {
        Row: ProductReviewRow
        Insert: {
          id?: string; produto_id: string; cliente_id?: string | null
          nome_autor: string; nota: number; comentario?: string | null
          compra_verificada?: boolean; aprovado?: boolean; criado_em?: string
        }
        Update: Partial<ProductReviewRow>
        Relationships: [{ foreignKeyName: "avaliacoes_produto_id_fkey"; columns: ["produto_id"]; isOneToOne: false; referencedRelation: "produtos"; referencedColumns: ["id"] }]
      }
      clientes: {
        Row: CustomerRow
        Insert: {
          id: string; nome_completo?: string | null; cpf?: string | null
          telefone?: string | null; email?: string | null
          papel_id?: string | null; ativo?: boolean
          criado_em?: string; atualizado_em?: string
        }
        Update: Partial<Omit<CustomerRow, "id">>
        Relationships: [{ foreignKeyName: "clientes_papel_id_fkey"; columns: ["papel_id"]; isOneToOne: false; referencedRelation: "perfis"; referencedColumns: ["id"] }]
      }
      enderecos: {
        Row: AddressRow
        Insert: {
          id?: string; cliente_id: string; rotulo?: string
          logradouro: string; numero: string; complemento?: string | null
          bairro: string; cidade: string; estado: string
          cep: string; padrao?: boolean; criado_em?: string
        }
        Update: Partial<AddressRow>
        Relationships: [{ foreignKeyName: "enderecos_cliente_id_fkey"; columns: ["cliente_id"]; isOneToOne: false; referencedRelation: "clientes"; referencedColumns: ["id"] }]
      }
      pedidos: {
        Row: OrderRow
        Insert: {
          id?: string; numero_pedido: string; cliente_id?: string | null
          nome_cliente: string; email_cliente: string
          telefone_cliente?: string | null; cpf_cliente?: string | null
          entrega_logradouro?: string | null; entrega_numero?: string | null
          entrega_complemento?: string | null; entrega_bairro?: string | null
          entrega_cidade?: string | null; entrega_estado?: string | null
          entrega_cep?: string | null
          forma_pagamento?: string; status_pagamento?: string; status?: string
          subtotal: number; frete?: number; total_desconto?: number; total: number
          codigo_rastreio?: string | null; previsao_entrega?: string | null
          observacoes?: string | null; criado_em?: string; atualizado_em?: string
        }
        Update: Partial<OrderRow>
        Relationships: [{ foreignKeyName: "pedidos_cliente_id_fkey"; columns: ["cliente_id"]; isOneToOne: false; referencedRelation: "clientes"; referencedColumns: ["id"] }]
      }
      itens_pedido: {
        Row: OrderItemRow
        Insert: {
          id?: string; pedido_id: string; produto_id?: string | null
          nome_produto: string; imagem_produto?: string | null; slug_produto?: string | null
          quantidade: number; preco_unitario: number; preco_total: number
        }
        Update: Partial<OrderItemRow>
        Relationships: [{ foreignKeyName: "itens_pedido_pedido_id_fkey"; columns: ["pedido_id"]; isOneToOne: false; referencedRelation: "pedidos"; referencedColumns: ["id"] }]
      }
      historico_pedidos: {
        Row: OrderStatusHistoryRow
        Insert: {
          id?: string; pedido_id: string; status: string; rotulo: string
          observacao?: string | null; criado_por?: string | null; criado_em?: string
        }
        Update: Partial<OrderStatusHistoryRow>
        Relationships: [{ foreignKeyName: "historico_pedidos_pedido_id_fkey"; columns: ["pedido_id"]; isOneToOne: false; referencedRelation: "pedidos"; referencedColumns: ["id"] }]
      }
      receitas: {
        Row: PrescriptionRow
        Insert: {
          id?: string; cliente_id?: string | null; pedido_id?: string | null
          nome_medico?: string | null; crm?: string | null; uf_crm?: string | null
          data_receita?: string | null; url_arquivo?: string | null; nome_arquivo?: string | null
          observacoes?: string | null; status?: string
          revisado_por?: string | null; revisado_em?: string | null
          motivo_rejeicao?: string | null; criado_em?: string; atualizado_em?: string
        }
        Update: Partial<PrescriptionRow>
        Relationships: []
      }
      newsletter: {
        Row: NewsletterRow
        Insert: {
          id?: string; email: string; nome?: string | null
          ativo?: boolean; origem?: string | null
          inscrito_em?: string; cancelado_em?: string | null
        }
        Update: Partial<NewsletterRow>
        Relationships: []
      }
      mensagens_contato: {
        Row: ContactMessageRow
        Insert: {
          id?: string; nome: string; email: string; telefone?: string | null
          assunto: string; mensagem: string; status?: string
          respondido_por?: string | null; respondido_em?: string | null
          texto_resposta?: string | null; criado_em?: string
        }
        Update: Partial<ContactMessageRow>
        Relationships: []
      }
      perfis: {
        Row: RoleRow
        Insert: { id?: string; nome: string; descricao?: string | null; criado_em?: string }
        Update: Partial<RoleRow>
        Relationships: []
      }
      permissoes: {
        Row: PermissionRow
        Insert: { id?: string; nome: string; descricao?: string | null; recurso: string; acao: string }
        Update: Partial<PermissionRow>
        Relationships: []
      }
      perfis_permissoes: {
        Row: { perfil_id: string; permissao_id: string }
        Insert: { perfil_id: string; permissao_id: string }
        Update: { perfil_id?: string; permissao_id?: string }
        Relationships: []
      }
      usuarios_perfis: {
        Row: { usuario_id: string; perfil_id: string; concedido_por: string | null; concedido_em: string }
        Insert: { usuario_id: string; perfil_id: string; concedido_por?: string | null; concedido_em?: string }
        Update: { usuario_id?: string; perfil_id?: string; concedido_por?: string | null; concedido_em?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      fn_eh_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      fn_usuario_tem_permissao: {
        Args: { p_usuario_id: string; p_chave: string }
        Returns: boolean
      }
      fn_minhas_permissoes: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

// ── Aliases convenientes ─────────────────────────────────────────────────────

export type Category           = CategoryRow
export type Product            = ProductRow
export type ProductReview      = ProductReviewRow
export type Customer           = CustomerRow
export type Address            = AddressRow
export type Order              = OrderRow
export type OrderItem          = OrderItemRow
export type OrderStatusHistory = OrderStatusHistoryRow
export type Prescription       = PrescriptionRow

// Tipos de Insert
type Tables = Database["public"]["Tables"]
export type NewOrder        = Tables["pedidos"]["Insert"]
export type NewOrderItem    = Tables["itens_pedido"]["Insert"]
export type NewProduct      = Tables["produtos"]["Insert"]
export type NewPrescription = Tables["receitas"]["Insert"]
export type NewAddress      = Tables["enderecos"]["Insert"]

// Joins comuns
export type ProductWithCategory = ProductRow & {
  categorias: Pick<CategoryRow, "slug" | "titulo"> | null
}

export type OrderWithItems = OrderRow & {
  itens_pedido: OrderItemRow[]
}

// Status literals (alinhados com os valores no banco)
export type OrderStatus        = "confirmado" | "manipulacao" | "despachado" | "transito" | "entregue" | "cancelado"
export type PaymentStatus      = "pendente" | "pago" | "falhou" | "estornado"
export type PrescriptionStatus = "aguardando_revisao" | "aprovado" | "rejeitado"
// NomePapel — nomes dos papéis no banco (para updateCustomerRole e exibição)
// Fase 2: farmaceutico e manipulador já existem no banco mas sem permissões
export type CustomerRole = "cliente" | "atendente" | "admin" | "farmaceutico" | "manipulador"
