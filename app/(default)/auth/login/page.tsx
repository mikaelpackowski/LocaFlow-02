// app/(default)/auth/login/page.tsx
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Se connecter | LocaFlow",
  description: "Connexion propriétaire ou locataire à LocaFlow.",
};

// (optionnel) évite tout pré-rendu statique si tu préfères
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <h1 className="mb-6 text-center text-3xl font-bold">Se connecter</h1>

      <Suspense fallback={<div className="text-center text-gray-500">Chargement…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
