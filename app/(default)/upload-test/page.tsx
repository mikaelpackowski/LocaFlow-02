"use client";
import { useState } from "react";

export default function UploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [out, setOut] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOut(null);
    if (!file) return setErr("Choisis un fichier.");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/storage/upload", { method: "POST", body: fd });
      const json = await r.json();
      if (!r.ok) throw new Error(json?.error || "Erreur upload");
      setOut(json);
    } catch (e: any) {
      setErr(e?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold">Test upload Supabase</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <button className="rounded-full bg-indigo-600 text-white px-4 py-2" disabled={loading}>
          {loading ? "Upload…" : "Uploader"}
        </button>
      </form>
      {err && <p className="text-red-600 mt-3">{err}</p>}
      {out && (
        <div className="mt-4">
          <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">{JSON.stringify(out, null, 2)}</pre>
          {out.publicUrl && (
            <>
              <a className="text-indigo-600 underline" href={out.publicUrl} target="_blank" rel="noreferrer">
                Ouvrir l’image
              </a>
              <div className="mt-3"><img src={out.publicUrl} alt="aperçu" className="max-w-full rounded border" /></div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
