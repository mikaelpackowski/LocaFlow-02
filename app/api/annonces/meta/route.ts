import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PropertyType } from "@prisma/client";

export const runtime = "nodejs";

export async function GET() {
  try {
    // valeurs distinctes côté DB pour les villes et types
    const [cityRows, typeRows] = await Promise.all([
      prisma.listing.findMany({ select: { city: true }, distinct: ["city"] }),
      prisma.listing.findMany({ select: { type: true }, distinct: ["type"] }),
    ]);

    const cities = cityRows
      .map((r) => r.city)
      .filter((v) => !!v && v.trim().length > 0)
      .sort((a, b) => a.localeCompare(b, "fr"));

    // types = enums ; on renvoie sous forme de strings d’enum
    const types = typeRows
      .map((r) => r.type as PropertyType)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "fr"));

    return NextResponse.json({ cities, types });
  } catch (e: any) {
    console.error("GET /api/annonces/meta error:", e);
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
