import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types"

// Cliente com service_role — bypassa RLS completamente
// NUNCA expor no browser. Use apenas em Server Components, Route Handlers e Server Actions.
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)
