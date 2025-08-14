import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.type || !["incident", "artisan", "owner-incident"].includes(body.type)) {
      return NextResponse.json({ ok: false, error: "Type invalide" }, { status: 400 });
    }
    if (!body?.title || typeof body.title !== "string") {
      return NextResponse.json({ ok: false, error: "Titre manquant" }, { status: 400 });
    }

    const ticketId = `TCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    return NextResponse.json({ ok: true, ticketId });
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }
}
