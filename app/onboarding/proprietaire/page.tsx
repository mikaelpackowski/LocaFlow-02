// app/onboarding/proprietaire/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function OnboardingProprietaire() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // (optionnel) pré-remplir si déjà en DB
    (async () => {
      const res = await fetch("/api/me");
      if (res.ok) {
        const me = await res.json();
        setName(me?.name ?? "");
        setPhone(me?.phone ?? "");
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const r = await fetch("/api/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setMsg(j?.error || "Erreur");
        return;
      }
      router.push("/billing/add-card"); // étape suivante (ajout CB) – ou dashboard direct si tu veux
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold">Mes informations</h1>
      <p className="text-gray-600 mt-2">Renseignez vos coordonnées.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Nom / Société</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Téléphone</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </div>

        <button className="rounded-full bg-indigo-600 text-white px-5 py-2.5 disabled:opacity-60" disabled={saving}>
          {saving ? "Enregistrement…" : "Continuer"}
        </button>

        {msg && <p className="text-sm text-red-600">{msg}</p>}
      </form>
    </main>
  );
}
