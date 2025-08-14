"use client";

import { useState } from "react";
import SubmitButton from "./SubmitButton";

export default function TenantArtisanForm() {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    const fd = new FormData(e.currentTarget);

    const payload = {
      type: "artisan" as const,
      title: fd.get("title"),
      trade: fd.get("trade"),
      preferredDate: fd.get("preferredDate"),
      timeslot: fd.get("timeslot"),
      budget: fd.get("budget"),
      description: fd.get("description"),
    };

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.ok) setErr(json.error || "Erreur lors de l’envoi.");
    else {
      setMsg(`Demande envoyée (#${json.ticketId})`);
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-xl border bg-white p-6 shadow-sm">
      {msg && <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-green-800">{msg}</div>}
      {err && <div className="rounded-md bg-rose-50 border border-rose-200 px-4 py-2 text-rose-800">{err}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-800">Objet</label>
        <input name="title" required placeholder="Ex. Chasse d’eau à remplacer"
               className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-800">Artisan</label>
          <select name="trade" className="mt-1 w-full rounded-lg border px-3 py-2">
            <option>Plombier</option><option>Électricien</option><option>Serrurier</option>
            <option>Électroménager</option><option>Autre</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Date souhaitée</label>
          <input type="date" name="preferredDate" className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Créneau</label>
          <select name="timeslot" className="mt-1 w-full rounded-lg border px-3 py-2">
            <option>Matin</option><option>Après-midi</option><option>Soir</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">Budget max (optionnel)</label>
        <input name="budget" type="number" min={0} className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">Description</label>
        <textarea name="description" rows={4} required
                  placeholder="Précisez le contexte, l’accès, le matériel, etc."
                  className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>Envoyer</SubmitButton>
        <a href="/locataire/dashboard" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Retour</a>
      </div>
    </form>
  );
}
