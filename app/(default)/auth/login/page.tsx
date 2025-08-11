import LoginForm from "./LoginForm";

export const metadata = {
  title: "Se connecter | LocaFlow",
  description: "Accédez à votre espace propriétaire ou locataire.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 py-24">
      <h1 className="text-2xl font-bold text-gray-900 text-center">Connexion</h1>
      <p className="mt-2 text-center text-gray-600">
        Connectez-vous pour accéder à votre espace.
      </p>

      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <LoginForm />
      </div>
    </main>
  );
}
