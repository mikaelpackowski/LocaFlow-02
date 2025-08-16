// components/billing/StripePostButton.tsx
"use client";

import { useState } from "react";

type Props = {
  endpoint: string;
  payload?: any;
  label: string;
  className?: string;
};

export default function StripePostButton({ endpoint, payload, label, className }: Props) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    try {
      setLoading(true);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur");
      if (data?.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert("Impossible d’ouvrir la page Stripe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={onClick} disabled={loading} className={className}>
      {loading ? "Veuillez patienter…" : label}
    </button>
  );
}
