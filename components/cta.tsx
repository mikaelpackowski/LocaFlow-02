import Image from "next/image";
import Link from "next/link";
import BlurredShape from "@/public/images/blurred-shape.svg";

export default function Cta() {
  return (
    <section className="relative overflow-hidden">
      {/* Arrière-plan flou */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-24 ml-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <Image
          className="max-w-none"
          src={BlurredShape}
          width={760}
          height={668}
          alt=""
        />
      </div>

      {/* Conteneur */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-gray-200 rounded-3xl py-12 md:py-20 shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            {/* Titre */}
            <h2
              className="text-3xl md:text-4xl font-extrabold animate-[gradient_8s_linear_infinite] bg-[linear-gradient(to_right,#4f46e5,#8b5cf6,#ec4899,#4f46e5)] bg-[length:200%_auto] bg-clip-text text-transparent mb-6"
              data-aos="fade-up"
            >
              Prêt à simplifier votre gestion locative ?
            </h2>

            {/* Sous-titre */}
            <p
              className="text-gray-600 mb-8 text-lg"
              data-aos="fade-up"
              data-aos-delay={200}
            >
              Rejoignez ForGesty et automatisez vos démarches en quelques clics.
            </p>

            {/* Boutons — même style que "Propriétaire" */}
            <div
              className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              data-aos="fade-up"
              data-aos-delay={400}
            >
              {/* Primaire : plein violet, arrondi, ombre légère */}
              <Link
                href="/proprietaire/inscription"
                className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-600 hover:-translate-y-0.5 active:translate-y-0"
              >
                {/* Icône user-plus */}
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M15 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 20a6 6 0 0 1 12 0v1H3v-1Zm16-9v-2m0 0V7m0 2h-2m2 0h2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Créer un compte gratuitement
              </Link>

              {/* Secondaire : contour, fond blanc, même rayon */}
              <Link
                href="/proprietaire"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
              >
                {/* Icône maison */}
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m3 11 9-7 9 7v8a2 2 0 0 1-2 2h-3v-6H8v6H5a2 2 0 0 1-2-2v-8Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Déposer un bien
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
