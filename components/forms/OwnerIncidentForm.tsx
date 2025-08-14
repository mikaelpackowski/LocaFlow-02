"use client";

import { useState } from "react";
import SubmitButton from "./SubmitButton";

export default function OwnerIncidentForm() {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    const fd = new FormData(e.currentTarget);

    const payload = {
      type: "owner-incident" as const,
      title: fd.get("title"),
      property: fd.get("property"),
      category: fd.get("category"),
      priority: fd.get("priority"),
      assignTo: fd.get("assignTo"),
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
      setMsg(`Ticket créé (#${json.ticketId})`);
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-xl border bg-white p-6 shadow-sm">
      {msg && <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-green-800">{msg}</div>}
      {err && <div className="rounded-md bg-rose-50 border border-rose-200 px-4 py-2 text-rose-800">{err}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-800">Titre</label>
        <input name="title" required placeholder="Ex. Infiltration plafond salon"
               className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-800">Bien concerné</label>
          <input name="property" placeholder="Ex. T2 – 12 rue Exemple, Paris"
                 className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Catégorie</label>
          <select name="category" className="mt-1 w-full rounded-lg border px-3 py-2">
            <option>Plomberie</option><option>Électricité</option><option>Chauffage</option>
            <option>Serrurerie</option><option>Autre</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-800">Priorité</label>
          <select name="priority" className="mt-1 w-full rounded-lg border px-3 py-2">
            <option>Basse</option><option>Normale</option><option>Haute</option><option>Critique</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Assigner à (optionnel)</label>
          <input name="assignTo" placeholder="Ex. Plombier Martin / prestataire"
                 className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">Description</label>
        <textarea name="description" rows={4} required
                  placeholder="Détail du problème, photos prévues, dispo locataire, etc."
                  className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>Créer le ticket</SubmitButton>
        <a href="/proprietaire/dashboard" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Retour</a>
      </div>
    </form>
  );
}
