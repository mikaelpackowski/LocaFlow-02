"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const planFromURL = sp?.get("plan") ?? ""; // price_xxx Stripe

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "tenant">("owner");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Démo : si un plan est passé, on le garde pour le Checkout après login
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    // Etape “création” (démo) : on se connecte directement via Credentials
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role,
      name,
      // callbackUrl géré manuellement après éventuel Checkout
    });

    if (!res || res.error) {
      setErr(res?.error ?? "Impossible de créer le compte.");
      return;
    }

    // Si un plan est présent → on lance le Checkout Stripe
    if (planFromURL) {
      try {
        const fd = new FormData();
        fd.set("priceId", planFromURL);
        fd.set("mode", "subscription");

        const resp = await fetch("/api/billing/checkout", { method: "POST", body: fd });
        const data = await resp.json();
        if (!resp.ok || !data.url) throw new Error(data.error || "Erreur Checkout");
        window.location.href = data.url; // redirection vers Stripe
        return;
      } catch (e: any) {
        setErr(e.message || "Erreur lors du paiement.");
        return;
      }
    }

    // Sinon, on envoie sur l’espace abonnement
    startTransition(() => router.push("/compte/abonnement"));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {err && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {err}
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-gray-800">Nom</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="Votre nom"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-800">Email</label>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="vous@exemple.com"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-800">Mot de passe</label>
        <input
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-800">Je suis</label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`rounded-lg border px-3 py-2 text-sm ${
              role === "owner"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "hover:bg-gray-50"
            }`}
          >
            Propriétaire
          </button>
          <button
            type="button"
            onClick={() => setRole("tenant")}
            className={`rounded-lg border px-3 py-2 text-sm ${
              role === "tenant"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "hover:bg-gray-50"
            }`}
          >
            Locataire
          </button>
        </div>
      </div>

      {/* On garde le plan passé dans l’URL (utile si on “reposte” le form côté serveur un jour) */}
      {planFromURL && <input type="hidden" name="plan" value={planFromURL} />}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {pending ? "Création du compte…" : "Créer mon compte"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Déjà inscrit ?{" "}
        <a href={`/auth/login?plan=${encodeURIComponent(planFromURL)}`} className="text-indigo-600 hover:underline">
          Se connecter
        </a>
      </p>
    </form>
  );
}
