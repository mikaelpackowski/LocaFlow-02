import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Créer un compte | ForGesty",
  description: "Créez votre compte pour activer votre abonnement.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
      <p className="mt-1 text-gray-600">
        Renseignez vos informations pour activer votre abonnement.
      </p>

      {/* Next 13+/15 : hooks client (useSearchParams) doivent être dans un Suspense */}
      <div className="mt-6">
        <Suspense fallback={<div className="text-gray-500">Chargement…</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}
