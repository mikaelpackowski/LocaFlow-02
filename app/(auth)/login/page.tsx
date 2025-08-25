// app/(auth)/login/page.tsx
"use client";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClientComponentClient(); const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message); else router.push("/annonces");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-bold">Se connecter</h1>
        <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Mot de passe" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="w-full bg-indigo-600 text-white rounded py-2">Connexion</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </main>
  );
}
