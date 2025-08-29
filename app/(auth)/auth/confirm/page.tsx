"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] grid place-items-center text-sm text-gray-500">
          Validation en cours…
        </main>
      }
    >
      <ConfirmInner />
    </Suspense>
  );
}

function ConfirmInner() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const sp = useSearchParams();

  const next = sp.get("next") || "/";
  const role = sp.get("role") || "";
  const plan = sp.get("plan") || "";
  const trial = sp.get("trial") || "";

  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const params = url.searchParams;

        // Supabase envoie souvent ?type=signup&token_hash=...
        const tokenHash = params.get("token_hash");
        const type = (params.get("type") || "signup") as
          | "signup"
          | "magiclink"
          | "recovery"
          | "email_change";

        let err: unknown = null;

        if (tokenHash) {
          // Lien e-mail style token_hash
          const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash: tokenHash,
          });
          err = error;
        } else {
          // PKCE (code dans l’URL)
          const { error } = await supabase.auth.exchangeCodeForSession(url.href);
          err = error;
        }

        if (err) {
          setMsg("Lien invalide ou expiré.");
          return;
        }

        // Onboarding propriétaire si demandé
        if (role === "owner" && plan) {
          const { data: s } = await supabase.auth.getSession();
          const token = s.session?.access_token ?? null;

          const r = await fetch("/api/onboarding/owner", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ plan, trial }),
          });

          if (!r.ok) {
            const j = await r.json().catch(() => ({}));
            setMsg(j?.error || "Erreur d’onboarding.");
            return;
          }
        }

        // Redirection finale
        const profileStep =
          role === "owner"
            ? "/onboarding/proprietaire"
            : role === "tenant"
            ? "/onboarding/locataire"
            : null;

        router.replace(profileStep || next);
      } catch {
        setMsg("Erreur inattendue.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, role, plan, trial, next]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
