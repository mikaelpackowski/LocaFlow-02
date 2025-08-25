// app/api/debug/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const c = await cookies(); // 👈 await requis
  const access = c.get("sb-access-token")?.value ?? null;
  const refresh = c.get("sb-refresh-token")?.value ?? null;

  return NextResponse.json({
    loggedIn: !!access,
    accessTokenPreview: access ? access.slice(0, 24) + "…" : null,
    hasRefreshToken: !!refresh,
  });
}
