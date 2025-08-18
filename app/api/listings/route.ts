// app/api/listings/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const city = searchParams.get("city") || undefined;
  const type = searchParams.get("type") || undefined; // "APPARTEMENT" etc.
  const minRent = Number(searchParams.get("minRent")) || undefined;
  const maxRent = Number(searchParams.get("maxRent")) || undefined;
  const bedrooms = Number(searchParams.get("bedrooms")) || undefined;
  const furnished = searchParams.get("furnished");
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(30, Number(searchParams.get("pageSize")) || 12);
  const sort = searchParams.get("sort") || "recent";

  const where: any = { status: "PUBLISHED" };
  if (q) where.OR = [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }];
  if (city) where.city = { equals: city, mode: "insensitive" };
  if (type) where.type = type;
  if (minRent) where.rent = { ...(where.rent || {}), gte: minRent };
  if (maxRent) where.rent = { ...(where.rent || {}), lte: maxRent };
  if (Number.isFinite(bedrooms)) where.bedrooms = { gte: bedrooms };
  if (furnished === "true") where.furnished = true;
  if (furnished === "false") where.furnished = false;

  const orderBy =
    sort === "rent_asc" ? { rent: "asc" as const } :
    sort === "rent_desc" ? { rent: "desc" as const } :
    { createdAt: "desc" as const };

  const [total, items] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      include: { images: { orderBy: { sort: "asc" }, take: 1 } },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    total,
    page, pageSize,
    items: items.map((l) => ({
      id: l.id,
      title: l.title,
      city: l.city,
      type: l.type,
      rent: l.rent,
      charges: l.charges,
      bedrooms: l.bedrooms,
      surface: l.surface,
      furnished: l.furnished,
      image: l.images[0]?.url || null,
      createdAt: l.createdAt,
    })),
  });
}
