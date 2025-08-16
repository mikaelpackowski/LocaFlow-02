"use client";

import { useState } from "react";

export default function BillingButtons({
  priceId,
  hasSubscription,
}: {
  priceId?: string;           // requis si achat
  hasSubscription?: boolean;  // si true → affiche "Gérer mon abonnement"
}) {
  const [loading, setLoading] = useState(false);

  async function goCheckout() {
    if (!priceId) return;
    setLoading(true);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Erreur checkout");
  }

  async function goPortal() {
    setLoading(true);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Erreur portail");
  }

  if (hasSubscription) {
    return (
      <button
        onClick={goPortal}
        disabled={loading}
        className="w-full rounded-full border px-4 py-2 font-semibold hover:bg-gray-50"
      >
        {loading ? "Ouverture…" : "Gérer mon abonnement"}
      </button>
    );
  }

  return (
    <button
      onClick={goCheckout}
      disabled={loading || !priceId}
      className="w-full rounded-full bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
    >
      {loading ? "Redirection…" : "Choisir cette offre"}
    </button>
  );
}
