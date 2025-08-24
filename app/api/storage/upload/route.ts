import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const filename = `uploads/${Date.now()}-${file.name}`;

    // Upload dans le bucket "annonces"
    const { data, error } = await supabaseAdmin.storage
      .from("annonces")
      .upload(filename, Buffer.from(arrayBuffer), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Génère l’URL publique
    const { data: pub } = supabaseAdmin.storage.from("annonces").getPublicUrl(filename);

    return NextResponse.json({ ok: true, path: data?.path, publicUrl: pub.publicUrl });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json({ error: e?.message ?? "Erreur upload" }, { status: 500 });
  }
}
