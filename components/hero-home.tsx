import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative">
      {/* Image de fond */}
      <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden md:h-[78vh]">
        <Image
          src="/images/hero-header.jpg"
          alt="Façades d'immeubles parisiens"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-4 sm:px-6">
          <div className="w-full text-center">
            <h1 className="mx-auto max-w-4xl text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Gérez vos biens en toute simplicité avec{" "}
              <span className="bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text text-transparent">
                ForGesty
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-white/85">
              Dépôt de bien, gestion locative, suivi des loyers et automatisations — tout sur une seule plateforme.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full bg-violet-500 px-7 py-3 text-white font-semibold shadow-lg shadow-black/20 transition hover:bg-violet-600 hover:-translate-y-0.5 active:translate-y-0"
              >
                Commencer maintenant
              </a>
              <a
                href="/presentation"
                className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur px-7 py-3 font-semibold text-white border border-white/30 shadow-md transition hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                Découvrir {/** nom visible si tu gardes la page */} ForGesty
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-gray-200 py-12 md:py-16" />
      </div>
    </section>
  );
}
