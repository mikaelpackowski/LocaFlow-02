// lib/supabase-admin.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ⚠️ Ne JAMAIS exposer cette clé côté client
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin: SupabaseClient = createClient(url, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
