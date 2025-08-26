// app/(auth)/inscription/page.tsx (remplace juste handleSignup)
async function handleSignup(e: React.FormEvent) {
  e.preventDefault();
  setMsg("");

  const next = returnTo || "/dashboard/proprietaire";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.forgesty.com";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}&role=${role ?? ""}&plan=${plan ?? ""}&trial=${trial ?? ""}`,
    },
  });

  if (error) {
    setMsg(error.message);
    return;
  }

  setMsg("Un e-mail de confirmation vient de vous être envoyé. Cliquez sur le lien pour continuer.");
}
