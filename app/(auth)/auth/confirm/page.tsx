// app/(auth)/auth/confirm/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ConfirmPage() {
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
      // 1) Échange du code contenu dans l’URL contre une session
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        setMsg("Lien invalide ou expiré.");
        return;
      }

      // 2) Si propriétaire, on crée/maj l’abonnement (essai 1 mois, etc.)
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

      // 3) Redirection vers l’onboarding profil d’abord
      const profileStep =
        role === "owner" ? "/onboarding/proprietaire" :
        role === "tenant" ? "/onboarding/locataire" :
        null;

      router.replace(profileStep || next);
    })();
  }, [supabase, role, plan, trial, next, router]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
