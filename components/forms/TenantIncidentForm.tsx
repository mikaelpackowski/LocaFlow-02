"use client";

import { useState } from "react";
import SubmitButton from "./SubmitButton";

export default function TenantIncidentForm() {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    const fd = new FormData(e.currentTarget);

    const payload = {
      type: "incident" as const,
      title: fd.get("title"),
      category: fd.get("category"),
      urgency: fd.get("urgency"),
      description: fd.get("description"),
      allowAccess: fd.get("allowAccess") === "on",
      phone: fd.get("phone"),
      address: fd.get("address"),
    };

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.ok) setErr(json.error || "Erreur lors de l’envoi.");
    else {
      setMsg(`Problème signalé (#${json.ticketId})`);
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-xl border bg-white p-6 shadow-sm">
      {msg && <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-green-800">{msg}</div>}
      {err && <div className="rounded-md bg-rose-50 border border-rose-200 px-4 py-2 text-rose-800">{err}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-800">Titre du problème</label>
        <input name="title" required placeholder="Ex. Fuite sous l’évier"
               className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-800">Catégorie</label>
          <select name="category" className="mt-1 w-full rounded-lg border px-3 py-2">
            <option>Plomberie</option><option>Électricité</option><option>Chauffage</option>
            <option>Serrurerie</option><option>Autre</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Urgence</label>
          <select name="urgency" className="mt-1 w-full rounded-lg border px-3 py-2">
            <option>Faible</option><option>Moyenne</option><option>Haute</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Téléphone</label>
          <input name="phone" type="tel" placeholder="06..." className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">Adresse (optionnel)</label>
        <input name="address" placeholder="Ex. 12 rue Exemple, Paris"
               className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">Description</label>
        <textarea name="description" rows={4} required
                  placeholder="Détaillez le problème, depuis quand, pièces impactées, etc."
                  className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" name="allowAccess" className="rounded border" />
        <span className="text-sm text-gray-700">J’autorise l’accès en mon absence si nécessaire</span>
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton>Envoyer</SubmitButton>
        <a href="/locataire/dashboard" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Retour</a>
      </div>
    </form>
  );
}
