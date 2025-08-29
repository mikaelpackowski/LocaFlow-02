// app/(auth)/auth/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const url = new URL(req.url);

  // Échange code/PKCE -> session (DOIT se faire côté serveur)
  const { error } = await supabase.auth.exchangeCodeForSession(url.toString());
  if (error) {
    // Optionnel: page d'erreur dédiée
    const err = new URL("/auth/confirm?error=invalid", url.origin);
    return NextResponse.redirect(err);
  }

  // On repasse les paramètres à /auth/confirm (qui fera l’onboarding + redirection finale)
  const next = url.searchParams.get("next") ?? "/dashboard/proprietaire";
  const role = url.searchParams.get("role") ?? "";
  const plan = url.searchParams.get("plan") ?? "";
  const trial = url.searchParams.get("trial") ?? "";

  const conf = new URL("/auth/confirm", url.origin);
  conf.searchParams.set("next", next);
  conf.searchParams.set("role", role);
  conf.searchParams.set("plan", plan);
  conf.searchParams.set("trial", trial);

  return NextResponse.redirect(conf);
}
