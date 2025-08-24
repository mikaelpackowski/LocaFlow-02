// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client uniquement côté serveur (no session)
export const supabaseServer = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
