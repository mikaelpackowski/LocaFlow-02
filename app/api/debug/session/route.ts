// app/api/debug/session/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  return NextResponse.json({ session });
}
