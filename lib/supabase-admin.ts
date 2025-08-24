// lib/supabase-admin.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Fabrique un client Supabase "service role" uniquement quand on l'appelle.
 * -> évite les erreurs de build si les variables d'env ne sont pas présentes.
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin non configuré : définis NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
