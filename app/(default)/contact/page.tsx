export const metadata = {
  title: "Contact – LocaFlow",
  description: "Contactez notre équipe pour toute question.",
};

export default function ContactPage() {
  return (
    <section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">Contact</h1>
          <p className="mt-3 text-gray-600">Une question ? Écrivez-nous, on vous répond vite.</p>
        </header>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Formulaire (placeholder) */}
          <form className="rounded-xl border p-6">
            <div className="grid gap-4">
              <input className="rounded-lg border px-4 py-3" placeholder="Votre nom" />
              <input className="rounded-lg border px-4 py-3" placeholder="Votre e-mail" type="email" />
              <input className="rounded-lg border px-4 py-3" placeholder="Sujet" />
              <textarea className="min-h-[140px] rounded-lg border px-4 py-3" placeholder="Votre message" />
              <button className="rounded-lg bg-gray-900 px-5 py-3 text-white font-semibold hover:bg-gray-800">
                Envoyer
              </button>
            </div>
          </form>

          {/* Coordonnées */}
          <div className="rounded-xl border p-6">
            <h3 className="font-semibold mb-3">Nos coordonnées</h3>
            <p className="text-gray-600">LocaFlow<br/>Paris, France</p>
            <p className="mt-3 text-gray-600">contact@locaflow.app</p>
            <p className="mt-1 text-gray-600">+33 1 23 45 67 89</p>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Support</h4>
              <p className="text-gray-600">
                Consultez d’abord la <a className="text-indigo-600 hover:underline" href="/faq">FAQ</a>, ou envoyez-nous un e-mail.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
