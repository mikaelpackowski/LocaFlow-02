import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/annonces/meta -> { cities: string[], types: string[] }
export async function GET() {
  try {
    // Deux requêtes distinctes pour obtenir des valeurs uniques
    const [cityRows, typeRows] = await Promise.all([
      prisma.listing.findMany({
        select: { city: true },
        where: { city: { not: null } },
        distinct: ["city"],
      }),
      prisma.listing.findMany({
        select: { type: true },
        where: { type: { not: null } },
        distinct: ["type"],
      }),
    ]);

    const cities = cityRows
      .map((r) => r.city!)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "fr"));

    const types = typeRows
      .map((r) => r.type!)
      .filter(Boolean)
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
