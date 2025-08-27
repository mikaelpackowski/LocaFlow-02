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

  const next = sp.get("next") || "/proprietaire/dashboard";
  const role = sp.get("role") || "";
  const plan = sp.get("plan") || "";
  const trial = sp.get("trial") || "";

  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    let ran = false;

    (async () => {
      if (ran) return;
      ran = true;

      // 1) Récupérer les params depuis le hash du lien magique Supabase
      //    (format: /auth/confirm#access_token=...&type=signup&...)
      const hash = window.location.hash?.substring(1) || "";
      const hashParams = new URLSearchParams(hash);

      if (!hashParams.has("access_token") && !hashParams.has("code")) {
        setMsg("Lien invalide ou expiré.");
        return;
      }

      // 2) Échanger le code contre une session
      //    Supabase attend un URLSearchParams (pas l’URL complète)
      const { error } = await supabase.auth.exchangeCodeForSession(hashParams);
      if (error) {
        setMsg("Lien invalide ou expiré.");
        return;
      }

      // Optionnel : nettoyer le hash de l’URL
      history.replaceState(null, "", window.location.pathname + window.location.search);

      // 3) Onboarding propriétaire si demandé
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

      // 4) Redirection finale
      const profileStep =
        role === "owner" ? "/onboarding/proprietaire" :
        role === "tenant" ? "/onboarding/locataire" :
        null;

      setMsg("✅ Email confirmé, redirection…");
      router.replace(profileStep || next);
    })();
  }, [supabase, router, role, plan, trial, next]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
