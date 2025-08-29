// app/(auth)/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const supabase = createRouteHandlerClient({ cookies });

  // ✅ Must be a string (full URL)
  const { error } = await supabase.auth.exchangeCodeForSession(url.toString());
  if (error) {
    // Optional: surface the error
    const errUrl = new URL("/auth/confirm", url.origin);
    errUrl.searchParams.set("error", "invalid_link");
    return NextResponse.redirect(errUrl);
  }

  // Forward the original params to /auth/confirm (they'll be useful for onboarding)
  const next = url.searchParams.get("next") || "/";
  const role = url.searchParams.get("role") || "";
  const plan = url.searchParams.get("plan") || "";
  const trial = url.searchParams.get("trial") || "";

  const redirect = new URL("/auth/confirm", url.origin);
  redirect.searchParams.set("next", next);
  if (role) redirect.searchParams.set("role", role);
  if (plan) redirect.searchParams.set("plan", plan);
  if (trial) redirect.searchParams.set("trial", trial);

  return NextResponse.redirect(redirect);
}
