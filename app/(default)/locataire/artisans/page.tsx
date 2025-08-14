import TenantArtisanForm from "@/components/forms/TenantArtisanForm";

export const metadata = {
  title: "Besoin d’un artisan | LocaFlow",
  description: "Demande d’intervention (plombier, électricien, etc.).",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Besoin d’un artisan</h1>
      <p className="mt-1 text-gray-600">Choisissez le corps de métier et vos disponibilités.</p>
      <TenantArtisanForm />
    </main>
  );
}
