// lib/supabaseServer.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Client Supabase "serveur" sans intégration cookies.
 * - Suffisant pour requêtes publiques ou simples appels côté serveur.
 * - Pour la lecture stricte de session via cookies, on utilise plutôt nos helpers
 *   (ex: lecture directe des cookies sb-access-token) dans les routes qui en ont besoin.
 */
export function createSupabaseServerClient(): SupabaseClient {
  return createClient(url, anon, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
