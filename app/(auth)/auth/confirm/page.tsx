"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ONBOARDING_KEY = "fg_onboarding";

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

  // URL (rarement présents avec PKCE)
  let next = sp.get("next") || "";
  let role = sp.get("role") || "";
  let plan = sp.get("plan") || "";
  let trial = sp.get("trial") || "";

  // Si manquants, on relit ce qu’on a stocké au signup
  if (!role || !plan || !next) {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(ONBOARDING_KEY) : null;
      if (raw) {
        const saved = JSON.parse(raw);
        next = next || saved?.next || "/";
        role = role || saved?.role || "";
        plan = plan || saved?.plan || "";
        trial = trial || "";
      }
    } catch {}
  }
  next = next || "/";

  const tokenHash = sp.get("token_hash");
  const type = (sp.get("type") || "").toLowerCase();
  const email = sp.get("email") || "";
  const code = sp.get("code");

  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    (async () => {
      try {
        const pre = await supabase.auth.getSession();
        if (pre.data.session) {
          await afterAuth();
          return;
        }

        if (tokenHash && type && email) {
          const { error } = await supabase.auth.verifyOtp({
            email,
            token_hash: tokenHash,
            type: type as "signup" | "magiclink" | "recovery" | "invite" | "email_change",
          });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.search);
          if (error) throw error;
        } else {
          setMsg("Lien invalide ou expiré.");
          return;
        }

        await afterAuth();
      } catch (e) {
        console.error(e);
        setMsg("Lien invalide ou expiré.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenHash, type, email, code]);

  const afterAuth = async () => {
    try {
      // Onboarding propriétaire → création Subscription
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

      // Nettoyage et redirection
      try { localStorage.removeItem(ONBOARDING_KEY); } catch {}
      const profileStep =
        role === "owner" ? "/onboarding/proprietaire" :
        role === "tenant" ? "/onboarding/locataire" :
        null;

      router.replace(profileStep || next || "/");
    } catch (e) {
      console.error(e);
      setMsg("Erreur pendant la redirection.");
    }
  };

  return <Screen msg={msg} />;
}
