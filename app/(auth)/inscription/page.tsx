// ...imports...

const ONBOARDING_KEY = "fg_onboarding";

async function handleSignup(e: React.FormEvent) {
  e.preventDefault();
  setMsg(null);
  setLoading(true);

  try {
    // 1) on mémorise le choix (role/plan/trial/next)
    const payload = {
      role: role || "",
      plan: plan || "",
      trial: trial || "",
      next: returnTo || "/",
    };
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(payload));

    // 2) redirect_to SANS querystring exotique
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://www.forgesty.com";
    const confirmUrl = `${origin}/auth/confirm`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: confirmUrl },
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg(
      "Un e-mail de confirmation vient de vous être envoyé. Cliquez sur le lien pour continuer."
    );
  } catch (err: any) {
    setMsg(err?.message || "Erreur inconnue");
  } finally {
    setLoading(false);
  }
}
