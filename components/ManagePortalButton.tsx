"use client";

import { useState } from "react";

export default function ManagePortalButton() {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    try {
      setLoading(true);
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (res.ok && data?.url) {
        window.location.href = data.url; // redirection vers Stripe
      } else {
        alert(data?.error || "Impossible d’ouvrir le portail de facturation.");
      }
    } catch (e: any) {
      alert(e?.message || "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center rounded-full border px-5 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
    >
      {loading ? "Ouverture…" : "Gérer mon abonnement"}
    </button>
  );
}
