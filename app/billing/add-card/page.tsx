// app/billing/add-card/page.tsx
"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function AddCardForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSaving(true);
    setMsg(null);
    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: `${window.location.origin}/dashboard/proprietaire` },
      redirect: "if_required",
    });

    if (error) setMsg(error.message || "Erreur de paiement");
    else router.push("/dashboard/proprietaire");
    setSaving(false);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <PaymentElement />
      <button className="rounded-full bg-indigo-600 text-white px-5 py-2.5 disabled:opacity-60" disabled={saving || !stripe || !elements}>
        {saving ? "Enregistrement…" : "Enregistrer ma carte"}
      </button>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
    </form>
  );
}

export default function AddCardPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/billing/setup-intent", { method: "POST" });
      const j = await r.json();
      setClientSecret(j.clientSecret || null);
    })();
  }, []);

  if (!clientSecret) return <div className="min-h-[50vh] grid place-items-center">Chargement…</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <AddCardForm />
    </Elements>
  );
}
