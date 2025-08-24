import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/annonces/meta -> { cities: string[], types: string[] }
export async function GET() {
  try {
    const [cityRows, typeRows] = await Promise.all([
      prisma.listing.findMany({
        select: { city: true },
        distinct: ["city"],
      }),
      prisma.listing.findMany({
        select: { type: true },
        distinct: ["type"],
      }),
    ]);

    const cities = cityRows
      .map((r) => r.city) // city non-nullable -> string
      .filter((v) => !!v && v.trim().length > 0)
      .sort((a, b) => a.localeCompare(b, "fr"));

    const types = typeRows
      .map((r) => r.type) // type non-nullable -> string
      .filter((v) => !!v && v.trim().length > 0)
      .sort((a, b) => a.localeCompare(b, "fr"));

    return NextResponse.json({ cities, types });
  } catch (e: any) {
    console.error("GET /api/annonces/meta error:", e);
    return NextResponse.json(
      { error: e?.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}
