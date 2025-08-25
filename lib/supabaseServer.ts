// lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client Supabase lié aux cookies (lecture de session côté serveur)
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, opts: any) {
        try {
          cookieStore.set({ name, value, ...opts });
        } catch {
          // en route API serverless, Next peut interdire set(); on ignore
        }
      },
      remove(name: string, opts: any) {
        try {
          cookieStore.set({ name, value: "", ...opts });
        } catch {
          // idem
        }
      },
    },
  });
}
