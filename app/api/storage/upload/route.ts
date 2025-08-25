// app/api/storage/upload/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin"; // ✅ corrige l'import

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Expects a multipart/form-data with:
 *  - file: Blob/File
 *  - bucket (optional, default "public")
 *  - path (optional, default generated)
 *
 * Returns: { url }
 */
export async function POST(req: Request) {
  try {
    // Lire le form-data
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const bucket = (form.get("bucket") as string) || "public";
    const customPath = (form.get("path") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "file requis" }, { status: 400 });
    }

    // Construire un chemin si non fourni
    const ext = file.name?.split(".").pop() || "bin";
    const name = crypto.randomUUID();
    const path = customPath || `${name}.${ext}`;

    // Upload via service role (admin)
    const { data, error } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Construire l’URL publique (si le bucket est public)
    const { data: pub } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({
      ok: true,
      path: data?.path,
      url: pub.publicUrl, // utilisable directement si bucket public
    });
  } catch (e: any) {
    console.error("POST /api/storage/upload error:", e);
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
