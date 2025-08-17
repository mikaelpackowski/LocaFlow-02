// app/(default)/auth/register/page.tsx
import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Créer un compte | ForGesty",
  description: "Renseignez vos informations pour activer votre abonnement.",
};

type SP = { plan?: string };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  // Next 15: searchParams peut être un Promise
  const sp = (await searchParams) ?? {};
  const planFromUrl = typeof sp.plan === "string" ? sp.plan : "";

  return (
    <main className="mx-auto max-w-xl px-4 sm:px-6 py-10">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p className="mt-1 text-gray-600">
          Renseignez vos informations pour activer votre abonnement.
        </p>
      </header>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <RegisterForm defaultPlan={planFromUrl} />
      </div>
    </main>
  );
}
