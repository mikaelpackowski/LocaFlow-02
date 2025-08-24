"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";

type FormState = {
  title: string;
  description: string;
  type: "APPARTEMENT" | "MAISON" | "STUDIO" | "LOFT" | "LOCAL" | "";
  leaseType: "VIDE" | "MEUBLE" | "";
  city: string;
  address: string;
  rent: string;
  charges: string;
  bedrooms: string;
  surface: string;
  furnished: boolean;
  status: "PUBLISHED" | "DRAFT";
  availableAt: string; // yyyy-mm-dd
};

const initial: FormState = {
  title: "",
  description: "",
  type: "",
  leaseType: "",
  city: "",
  address: "",
  rent: "",
  charges: "",
  bedrooms: "0",
  surface: "",
  furnished: false,
  status: "PUBLISHED",
  availableAt: "",
};

export default function NewListingPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOkMsg(null);
    setSubmitting(true);
    try {
      // Construction du payload pour POST /api/annonces
      const payload: any = {
        title: form.title.trim(),
        description: form.description.trim(),
        type: form.type,
        leaseType: form.leaseType,
        city: form.city.trim(),
        address: form.address.trim() || null,
        rent: Number(form.rent || 0),
        charges: Number(form.charges || 0),
        bedrooms: Number(form.bedrooms || 0),
        surface: Number(form.surface || 0),
        furnished: Boolean(form.furnished),
        status: form.status,
        availableAt: form.availableAt ? new Date(form.availableAt).toISOString() : null,
        images, // URLs publiques renvoyées par le composant d'upload
      };

      const res = await fetch("/api/annonces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.status === 401) {
        throw new Error("Vous devez être connecté pour publier une annonce.");
      }
      if (!res.ok) {
        throw new Error(json?.error || "Erreur lors de la création.");
      }

      setOkMsg("Annonce créée avec succès 🎉");
      setForm(initial);
      setImages([]);
    } catch (e: any) {
      setError(e?.message || "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Déposer une annonce</h1>
      <p className="text-gray-600 mt-2">
        Renseignez les informations ci-dessous. Les photos sont envoyées sur Supabase Storage.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre *</label>
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Studio meublé – Centre"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            className="mt-1 w-full rounded-lg border px-3 py-2 min-h-[120px]"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            required
          />
        </div>

        {/* Type / Bail / Ville / Adresse */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type *</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.type}
              onChange={(e) => update("type", e.target.value as any)}
              required
            >
              <option value="">Choisir…</option>
              <option value="APPARTEMENT">Appartement</option>
              <option value="MAISON">Maison</option>
              <option value="STUDIO">Studio</option>
              <option value="LOFT">Loft</option>
              <option value="LOCAL">Local</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type de bail *</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.leaseType}
              onChange={(e) => update("leaseType", e.target.value as any)}
              required
            >
              <option value="">Choisir…</option>
              <option value="VIDE">Vide</option>
              <option value="MEUBLE">Meublé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ville *</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Lyon"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="12 rue de la Soie"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>
        </div>

        {/* Prix / Surface / Chambres / Meublé / Disponibilité / Statut */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Loyer (€) *</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.rent}
              onChange={(e) => update("rent", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Charges (€) *</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.charges}
              onChange={(e) => update("charges", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Surface (m²) *</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.surface}
              onChange={(e) => update("surface", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Chambres</label>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.bedrooms}
              onChange={(e) => update("bedrooms", e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={form.furnished}
                onChange={(e) => update("furnished", e.target.checked)}
              />
              <span>Meublé</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Disponible le</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.availableAt}
              onChange={(e) => update("availableAt", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.status}
              onChange={(e) => update("status", e.target.value as any)}
            >
              <option value="PUBLISHED">Publié</option>
              <option value="DRAFT">Brouillon</option>
            </select>
          </div>
        </div>

        {/* Upload images */}
        <ImageUploader onChange={setImages} />

        {/* Actions */}
        <div className="pt-2 flex gap-3">
          <button
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-white disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Envoi…" : "Créer l’annonce"}
          </button>
          <button
            type="button"
            className="rounded-full border px-5 py-2.5"
            onClick={() => {
              setForm(initial);
              setImages([]);
              setError(null);
              setOkMsg(null);
            }}
          >
            Réinitialiser
          </button>
        </div>

        {error && <p className="text-red-600">{error}</p>}
        {okMsg && <p className="text-green-600">{okMsg}</p>}
        <p className="text-xs text-gray-500">
          Astuce : si vous n’êtes pas connecté, la création renverra <em>401 Unauthorized</em>.
        </p>
      </form>
    </main>
  );
}
