// app/api/storage/upload/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // par sûreté, évite toute statisation

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });

    const supabaseAdmin = getSupabaseAdmin(); // ← init LAZY ici

    const arrayBuffer = await file.arrayBuffer();
    const filename = `uploads/${Date.now()}-${file.name}`;

    const { data, error } = await supabaseAdmin.storage
      .from("annonces")
      .upload(filename, Buffer.from(arrayBuffer), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: pub } = supabaseAdmin.storage.from("annonces").getPublicUrl(filename);

    return NextResponse.json({ ok: true, path: data?.path, publicUrl: pub.publicUrl });
  } catch (e: any) {
    // Si les env manquent, l'erreur arrive ici (au runtime, pas au build)
    return NextResponse.json({ error: e?.message ?? "Erreur upload" }, { status: 500 });
  }
}
