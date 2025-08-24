import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

// GET /api/annonces/meta -> { cities: string[], types: string[] }
export async function GET() {
  const { data, error } = await supabaseServer
    .from("annonces")
    .select("city,type");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const cities = Array.from(new Set(rows.map(r => r.city).filter(Boolean as any)))
    .sort((a, b) => a.localeCompare(b, "fr"));
  const types = Array.from(new Set(rows.map(r => r.type).filter(Boolean as any)))
    .sort((a, b) => a.localeCompare(b, "fr"));

  return NextResponse.json({ cities, types });
}
