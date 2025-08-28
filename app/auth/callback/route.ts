import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { session } = await req.json(); // { event, session } possible aussi
  // Quand on reçoit la session côté client, on la pousse dans les cookies SSR
  if (session?.access_token && session?.refresh_token) {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  } else {
    // cas déconnexion
    await supabase.auth.signOut();
  }
  return NextResponse.json({ ok: true });
}
