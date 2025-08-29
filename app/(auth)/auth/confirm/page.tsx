// app/(auth)/auth/confirm/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
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

  // Params éventuels rajoutés par ton parcours
  const next = sp.get("next") || "/";
  const role = sp.get("role") || "";
  const plan = sp.get("plan") || "";
  const trial = sp.get("trial") || "";

  // Params envoyés par Supabase
  const type = (sp.get("type") || "signup") as any; // "signup" | "recovery" | ...
  const tokenHash = sp.get("token_hash"); // présent pour l’email (PKCE)

  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    (async () => {
      let authErr: string | undefined;

      // ✅ 1) Cas e-mail (PKCE) — on NE passe QUE token_hash + type
      if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({
          type,
          token_hash: tokenHash,
        });
        if (error) authErr = error.message;
      }
      // ✅ 2) Cas OAuth code / hash access_token
      else if (sp.get("code") || window.location.hash.includes("access_token")) {
        const { error } = await supabase.auth.exchangeCodeForSession(
          window.location.href // string attendu
        );
        if (error) authErr = error.message;
      }
      // Aucun param utile trouvé
      else {
        authErr = "Session absente. Réessayez depuis l’e-mail de confirmation.";
      }

      if (authErr) {
        setMsg(authErr);
        return;
      }

      // ✅ 3) Onboarding propriétaire -> crée/maj la Subscription
      if (role === "owner" && plan) {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

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

      // ✅ 4) Redirection finale
      router.replace(next);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, next, role, plan, trial, tokenHash, type, sp]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
