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

      // Le lien de supabase met les tokens dans le hash (#access_token=...)
      const hash = window.location.hash ?? "";
      const hasTokens =
        hash.includes("access_token=") || hash.includes("refresh_token=") || hash.includes("code=");

      if (!hasTokens) {
        setMsg("Lien invalide ou expiré.");
        return;
      }

      // 1) Tenter l’échange standard (dans ta version: string requis)
      const urlForSupabase = hash ? hash : window.location.href;
      let { error } = await supabase.auth.exchangeCodeForSession(urlForSupabase);

      // 2) Fallback: si l’échange échoue, tenter un setSession manuel depuis le hash
      if (error && hash) {
        const p = new URLSearchParams(hash.slice(1));
        const access_token = p.get("access_token");
        const refresh_token = p.get("refresh_token");
        if (access_token && refresh_token) {
          const res = await supabase.auth.setSession({ access_token, refresh_token });
          error = res.error ?? null;
        }
      }

      if (error) {
        setMsg("Lien invalide ou expiré.");
        return;
      }

      // Nettoyer le hash dans l’URL
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

      setMsg("✅ Email confirmé, redirection…");
      const profileStep =
        role === "owner" ? "/onboarding/proprietaire" :
        role === "tenant" ? "/onboarding/locataire" :
        null;

      router.replace(profileStep || next);
    })();
  }, [supabase, router, role, plan, trial, next]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
