"use client";

import { useRef, useState } from "react";

type UploadedImage = { url: string; name: string };
type Props = {
  label?: string;
  onChange?: (urls: string[]) => void; // renvoie les URLs publiques
  maxFiles?: number;
};

export default function ImageUploader({ label = "Photos", onChange, maxFiles = 6 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setLoading(true);

    const current = [...images];
    try {
      for (const file of Array.from(files)) {
        if (current.length >= maxFiles) break;
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/storage/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Upload échoué");
        current.push({ url: json.publicUrl, name: json.filename || file.name });
      }
      setImages(current);
      onChange?.(current.map((i) => i.url));
    } catch (e: any) {
      setError(e?.message || "Erreur upload");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(idx: number) {
    const next = images.filter((_, i) => i !== idx);
    setImages(next);
    onChange?.(next.map((i) => i.url));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="block"
        />
        {loading && <span className="text-sm text-gray-500">Envoi…</span>}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative rounded-lg overflow-hidden border">
              <img src={img.url} alt={img.name} className="aspect-video object-cover w-full" />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute top-1 right-1 rounded bg-black/60 px-2 py-1 text-xs text-white"
                aria-label="Supprimer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-gray-500">
        Jusqu’à {maxFiles} photos. Les images sont rendues publiques (bucket Supabase <code>annonces</code>).
      </p>
    </div>
  );
}
