export const metadata = {
  title: "FAQ – LocaFlow",
  description: "Questions fréquentes sur la location et la plateforme.",
};

const FAQ = [
  {
    q: "Comment publier une annonce ?",
    a: "Créez un compte propriétaire, ajoutez un bien puis suivez l’assistant d’annonce (photos, description, loyer).",
  },
  {
    q: "Puis-je signer mon bail en ligne ?",
    a: "Oui, la signature électronique est disponible pour sécuriser et accélérer la procédure.",
  },
  {
    q: "Comment fonctionnent les rappels de loyer ?",
    a: "Les rappels sont programmables et envoyés automatiquement par e-mail et/ou notification.",
  },
  {
    q: "Mes documents sont-ils sécurisés ?",
    a: "Oui, ils sont stockés de manière chiffrée et uniquement accessibles aux personnes autorisées.",
  },
];

export default function FAQPage() {
  return (
    <section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">FAQ</h1>
          <p className="mt-3 text-gray-600">Toutes les réponses aux questions les plus fréquentes.</p>
        </header>

        <div className="space-y-4">
          {FAQ.map((item, idx) => (
            <details key={idx} className="rounded-xl border p-5">
              <summary className="cursor-pointer list-none font-semibold">
                {item.q}
              </summary>
              <p className="mt-3 text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
