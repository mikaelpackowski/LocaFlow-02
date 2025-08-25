"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // 👈 ajouter ici
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function InscriptionPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const sp = useSearchParams(); // maintenant ça compile ✅

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const plan = sp.get("plan");
  const role = sp.get("role");
  const trial = sp.get("trial");
  const returnTo = sp.get("returnTo") || "/annonces";

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg(error.message);

    if (role === "owner" && plan) {
      await fetch("/api/onboarding/owner", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, trial }),
      });
    }

    router.push(returnTo);
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Créer un compte</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          S’inscrire
        </button>

        {msg && <p className="text-center text-sm text-gray-600">{msg}</p>}
      </form>
    </main>
  );
}
