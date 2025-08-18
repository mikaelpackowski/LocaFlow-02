// app/api/listings/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sort: "asc" } }, owner: { select: { id: true, name: true } } },
  });
  if (!listing || listing.status !== "PUBLISHED") {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, listing });
}
