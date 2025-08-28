"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<Screen msg="Validation en cours…" />}>
      <ConfirmInner />
    </Suspense>
  );
}

function Screen({ msg }: { msg: string }) {
  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
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

  const tokenHash = sp.get("token_hash");     // format PKCE (emails)
  const type = (sp.get("type") || "").toLowerCase(); // signup, magiclink, recovery, etc.
  const email = sp.get("email") || "";

  const code = sp.get("code");                // format OAuth/code
  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    (async () => {
      try {
        // 0) si déjà connecté (ex: double-clic), on passe à la suite
        const pre = await supabase.auth.getSession();
        if (pre.data.session) {
          await afterAuth();
          return;
        }

        // 1) Lien PKCE (token_hash + type + email) -> verifyOtp
        if (tokenHash && type && email) {
          const { error } = await supabase.auth.verifyOtp({
            email,
            token_hash: tokenHash,
            type: type as
              | "signup"
              | "magiclink"
              | "recovery"
              | "invite"
              | "email_change",
          });
          if (error) throw error;
        }
        // 2) Lien "code=" -> exchangeCodeForSession
        else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            window.location.search // Supabase attend l’URLSearchParams
          );
          if (error) throw error;
        } else {
          // aucun format reconnu
          setMsg("Lien invalide ou expiré.");
          return;
        }

        await afterAuth();
      } catch (e: any) {
        console.error(e);
        setMsg("Lien invalide ou expiré.");
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenHash, type, email, code]);

  // Après création de la session : onboarding éventuel + redirection
  const afterAuth = async () => {
    try {
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

      // Redirection finale
      const profileStep =
        role === "owner"
          ? "/onboarding/proprietaire"
          : role === "tenant"
          ? "/onboarding/locataire"
          : null;

      router.replace(profileStep || next);
    } catch (e) {
      console.error(e);
      setMsg("Erreur pendant la redirection.");
    }
  };

  return <Screen msg={msg} />;
}
