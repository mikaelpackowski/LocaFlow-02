"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <main className="min-h-[60vh] grid place-items-center text-sm text-gray-500">
        Validation en cours…
      </main>
    }>
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

  const token_hash = sp.get("token_hash");
  const type = sp.get("type"); // "signup" | "magiclink" | etc.
  const email = sp.get("email");
  const code = sp.get("code"); // flux PKCE (hash fragment transformé en query par redirection)

  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    (async () => {
      // 1) Vérifier le lien suivant le format reçu
      if (token_hash && type && email) {
        // Cas email + token_hash (template Supabase verif email)
        const { error } = await supabase.auth.verifyOtp({
          type: type as any,       // "signup" / "email_change" / "magiclink"
          token_hash,
          email,
        });
        if (error) {
          setMsg("Lien invalide ou expiré.");
          return;
        }
      } else if (code) {
        // Cas PKCE (lien avec ?code=...) -> on échange le code contre une session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMsg("Lien invalide ou expiré.");
          return;
        }
      } else {
        setMsg("Lien invalide ou expiré.");
        return;
      }

      // 2) Récupérer la session obtenue
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        setMsg("Impossible de créer la session.");
        return;
      }

      // 3) Pousser la session dans les cookies du serveur (bridge)
      await fetch("/auth/callback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ session }),
      });

      // 4) Onboarding éventuel (création/MAJ d’abonnement)
      if (role === "owner" && plan) {
        const r = await fetch("/api/onboarding/owner", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ plan, trial }),
        });
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          setMsg(j?.error || "Erreur d’onboarding.");
          return;
        }
      }

      // 5) Redirection finale
      router.replace(next);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
