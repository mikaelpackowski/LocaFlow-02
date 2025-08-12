import Image from "next/image";
import WorflowImg01 from "@/public/images/workflow-01.png";
import WorflowImg02 from "@/public/images/workflow-02.png";
import WorflowImg03 from "@/public/images/workflow-03.png";

export default function Workflows() {
  return (
    <section className="relative pt-20 md:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-3 pb-3">
            <span className="text-sm text-indigo-600/80">Fonctionnalités</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Comment fonctionne LocaFlow
            </span>
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            LocaFlow automatise les démarches pour vous faire gagner du temps, sans négliger vos priorités de gestion.
          </p>
        </div>

        {/* Cartes plus claires et images bien visibles */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            img={WorflowImg01}
            alt="Gestion simplifiée"
            tag="Gestion simplifiée"
            text="Gagnez du temps grâce à une plateforme intuitive qui centralise toutes vos démarches."
          />
          <Card
            img={WorflowImg02}
            alt="Suivi intelligent"
            tag="Suivi intelligent"
            text="Gardez une trace claire de chaque action : contrats, paiements, échanges."
          />
          <Card
            img={WorflowImg03}
            alt="Automatisations"
            tag="Automatisations"
            text="Laissez LocaFlow envoyer les rappels, courriers et documents à votre place."
          />
        </div>
      </div>
    </section>
  );
}

function Card({
  img,
  alt,
  tag,
  text,
}: {
  img: any;
  alt: string;
  tag: string;
  text: string;
}) {
  return (
    <article
      className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
    >
      {/* Bloc image lisible, sans overlay sombre */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="aspect-[4/3]">
          <Image
            src={img}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-500 will-change-transform hover:scale-105"
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            priority={false}
          />
        </div>
      </div>

      {/* Contenu clair */}
      <div className="p-6">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
          {tag}
        </span>
        <p className="mt-3 text-gray-700 leading-relaxed">{text}</p>
      </div>
    </article>
  );
}
