import type { SupabaseClient } from "@supabase/supabase-js"
import type { Customer, Address, NewAddress, CustomerRole } from "../types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = SupabaseClient<any>

// Perfil do cliente logado
export async function getCustomerProfile(db: DB, userId: string): Promise<Customer | null> {
  const { data, error } = await db
    .from("clientes")
    .select("*")
    .eq("id", userId)
    .single()

  if (error) return null
  return data as Customer
}

// Atualizar dados do perfil
export async function updateCustomerProfile(
  db: DB,
  userId: string,
  patch: { nome_completo?: string; telefone?: string; cpf?: string },
): Promise<Customer> {
  const { data, error } = await db
    .from("clientes")
    .update(patch)
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data as Customer
}

// Endereços do cliente
export async function getCustomerAddresses(db: DB, customerId: string): Promise<Address[]> {
  const { data, error } = await db
    .from("enderecos")
    .select("*")
    .eq("cliente_id", customerId)
    .order("padrao", { ascending: false })

  if (error) throw error
  return data as Address[]
}

// Criar endereço
export async function createAddress(db: DB, address: NewAddress): Promise<Address> {
  const { data, error } = await db
    .from("enderecos")
    .insert(address)
    .select()
    .single()

  if (error) throw error
  return data as Address
}

// Excluir endereço
export async function deleteAddress(db: DB, addressId: string): Promise<void> {
  const { error } = await db.from("enderecos").delete().eq("id", addressId)
  if (error) throw error
}

// Admin: listar todos os clientes com paginação
export async function getAllCustomers(
  db: DB,
  { page = 1, limit = 20, search }: { page?: number; limit?: number; search?: string } = {},
): Promise<{ customers: Customer[]; total: number }> {
  let query = db
    .from("clientes")
    .select("*", { count: "exact" })
    .order("criado_em", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) {
    query = query.or(`nome_completo.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data, count, error } = await query
  if (error) throw error
  return { customers: data as Customer[], total: count ?? 0 }
}

// Admin: alterar papel do cliente (busca o papel_id pelo nome)
export async function updateCustomerRole(
  db: DB,
  customerId: string,
  role: CustomerRole,
): Promise<Customer> {
  const { data: perfil, error: perfilError } = await db
    .from("perfis")
    .select("id")
    .eq("nome", role)
    .single()

  if (perfilError || !perfil) throw new Error(`Papel '${role}' não encontrado no banco.`)

  const { data, error } = await db
    .from("clientes")
    .update({ papel_id: (perfil as { id: string }).id })
    .eq("id", customerId)
    .select()
    .single()

  if (error) throw error
  return data as Customer
}
