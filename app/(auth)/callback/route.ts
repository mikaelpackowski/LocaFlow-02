// app/auth/callback/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });

  // IMPORTANT : utilise les params (code, token_hash/PKCE) présents dans l’URL
  await supabase.auth.exchangeCodeForSession(url.searchParams);

  // On récupère les paramètres pour poursuivre le parcours
  const next = url.searchParams.get("next") || "/";
  const role = url.searchParams.get("role") || "";
  const plan = url.searchParams.get("plan") || "";
  const trial = url.searchParams.get("trial") || "";

  // Rediriger vers la page de confirmation (ou directement dashboard)
  const confirmUrl = new URL("/auth/confirm", url.origin);
  confirmUrl.searchParams.set("next", next);
  if (role) confirmUrl.searchParams.set("role", role);
  if (plan) confirmUrl.searchParams.set("plan", plan);
  if (trial) confirmUrl.searchParams.set("trial", trial);

  return NextResponse.redirect(confirmUrl, { status: 302 });
}

export async function POST(request: Request) {
  // Certains SDK envoient un POST ; on gère pareil.
  const url = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.exchangeCodeForSession(url.searchParams);

  const next = url.searchParams.get("next") || "/";
  const role = url.searchParams.get("role") || "";
  const plan = url.searchParams.get("plan") || "";
  const trial = url.searchParams.get("trial") || "";

  const confirmUrl = new URL("/auth/confirm", url.origin);
  confirmUrl.searchParams.set("next", next);
  if (role) confirmUrl.searchParams.set("role", role);
  if (plan) confirmUrl.searchParams.set("plan", plan);
  if (trial) confirmUrl.searchParams.set("trial", trial);

  return NextResponse.redirect(confirmUrl, { status: 302 });
}
