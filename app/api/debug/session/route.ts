// app/api/debug/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Route de debug très simple : montre si les cookies Supabase sont présents.
export async function GET() {
  const c = cookies();
  const access = c.get("sb-access-token")?.value ?? null;
  const refresh = c.get("sb-refresh-token")?.value ?? null;

  return NextResponse.json({
    loggedIn: !!access,
    // on n’affiche qu’un excerpt pour ne pas exposer tout le token
    accessTokenPreview: access ? access.slice(0, 24) + "…" : null,
    hasRefreshToken: !!refresh,
  });
}
