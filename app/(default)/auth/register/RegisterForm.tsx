"use client";

import { useState } from "react";

export default function RegisterForm({ defaultPlan }: { defaultPlan?: string }) {
  const [plan, setPlan] = useState(defaultPlan || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/owners/register", {
      method: "POST",
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        password: form.get("password"),
        plan: form.get("plan"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Erreur à l’inscription");
      return;
    }

    // redirige vers paiement
    window.location.href = `/api/billing/checkout?plan=${plan}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="firstName" placeholder="Prénom" required />
      <input type="text" name="lastName" placeholder="Nom" required />
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Mot de passe" required />

      <input
        type="text"
        name="plan"
        defaultValue={plan}
        className="w-full border rounded px-3 py-2"
      />

      <button
        type="submit"
        className="w-full rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500"
      >
        Créer mon compte
      </button>
    </form>
  );
}
