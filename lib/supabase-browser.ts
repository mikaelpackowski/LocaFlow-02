// lib/supabase-browser.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ⚠️ À importer UNIQUEMENT dans des composants client (ou actions client)
export const supabaseBrowser: SupabaseClient = createClient(url, anonKey, {
  auth: {
    persistSession: true,        // garde l'utilisateur connecté (localStorage)
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
