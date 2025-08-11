// app/api/annonces/[slug]/route.ts
import { NextResponse } from "next/server";
import { LISTINGS } from "@/utils/listings";

export async function GET(_req: Request, context: any) {
  const slug = context?.params?.slug as string | undefined;
  const item = LISTINGS.find((l) => l.slug === slug);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}
