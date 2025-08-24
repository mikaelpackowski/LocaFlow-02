"use client";

import { useRef, useState } from "react";

type UploadedImage = { url: string; name: string; cover?: boolean };
type Props = {
  label?: string;
  maxFiles?: number;
  onChange?: (urlsInOrder: string[]) => void; // ordre = index (cover en 1er si choisi)
};

export default function ImageUploader({ label = "Photos", maxFiles = 8, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  function propagate(next: UploadedImage[]) {
    // place la cover en première position si elle existe
    const coverIdx = next.findIndex((i) => i.cover);
    const ordered =
      coverIdx > 0 ? [next[coverIdx], ...next.filter((_, i) => i !== coverIdx)] : next.slice();
    setImages(ordered);
    onChange?.(ordered.map((i) => i.url));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setLoading(true);
    try {
      const current = images.slice();
      for (const file of Array.from(files)) {
        if (current.length >= maxFiles) break;
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/storage/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Upload échoué");
        current.push({ url: json.publicUrl, name: json.filename || file.name, cover: false });
      }
      propagate(current);
    } catch (e: any) {
      setError(e?.message || "Erreur upload");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function setCover(idx: number) {
    const next = images.map((img, i) => ({ ...img, cover: i === idx }));
    propagate(next);
  }

  function move(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= images.length) return;
    const next = images.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    propagate(next);
  }

  function removeAt(idx: number) {
    const next = images.filter((_, i) => i !== idx);
    // si on supprime la cover, rien n'est cover; l'UI laissera l'utilisateur en choisir une autre
    propagate(next.map((i) => ({ ...i, cover: i.cover && idx !== 0 ? i.cover : i.cover })));
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
              {/* actions */}
              <div className="absolute inset-x-0 top-0 flex justify-between p-1">
                <button
                  type="button"
                  onClick={() => setCover(idx)}
                  className={`rounded px-2 py-0.5 text-xs ${
                    img.cover ? "bg-yellow-400 text-black" : "bg-black/60 text-white"
                  }`}
                  title="Définir comme couverture"
                >
                  {img.cover ? "Couverture" : "Définir cover"}
                </button>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    className="rounded bg-black/60 text-white px-2 py-0.5 text-xs"
                    title="Déplacer à gauche"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    className="rounded bg-black/60 text-white px-2 py-0.5 text-xs"
                    title="Déplacer à droite"
                  >
                    →
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute bottom-1 right-1 rounded bg-black/60 px-2 py-1 text-xs text-white"
                aria-label="Supprimer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-gray-500">
        Jusqu’à {maxFiles} photos. La première est utilisée comme <strong>couverture</strong>.
      </p>
    </div>
  );
}
