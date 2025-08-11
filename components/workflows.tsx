import Image from "next/image";
import WorflowImg01 from "@/public/images/workflow-01.png";
import WorflowImg02 from "@/public/images/workflow-02.png";
import WorflowImg03 from "@/public/images/workflow-03.png";
import Spotlight from "@/components/spotlight";

export default function Workflows() {
  return (
    <section className="relative pt-20 md:pt-32 border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="flex items-center justify-center gap-3 pb-3">
  <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-200/50"></div>
  <span className="text-sm bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
    Fonctionnalités
  </span>
  <div className="h-px w-16 bg-gradient-to-l from-transparent to-indigo-200/50"></div>
</div>

            <h2 className="text-3xl md:text-4xl font-extrabold animate-[gradient_8s_linear_infinite] bg-[linear-gradient(to_right,#4f46e5,#8b5cf6,#ec4899,#4f46e5)] bg-[length:200%_auto] bg-clip-text text-transparent">
              Comment fonctionne LocaFlow
            </h2>
            <p className="text-lg text-gray-600">
              LocaFlow automatise les démarches pour vous faire gagner du temps, sans négliger vos priorités de gestion.
            </p>
          </div>

          {/* Spotlight items */}
          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
            {/* Card 1 */}
            <WorkflowCard
              image={WorflowImg01}
              title="Gestion simplifiée"
              text="Gagnez du temps grâce à une plateforme intuitive qui centralise toutes vos démarches."
            />
            {/* Card 2 */}
            <WorkflowCard
              image={WorflowImg02}
              title="Suivi intelligent"
              text="Gardez une trace claire de chaque action : contrats, paiements, échanges."
            />
            {/* Card 3 */}
            <WorkflowCard
              image={WorflowImg03}
              title="Automatisations"
              text="Laissez LocaFlow envoyer les rappels, courriers et documents à votre place."
            />
          </Spotlight>
        </div>
      </div>
    </section>
  );
}

// ✅ Petite fonction pour éviter de répéter 3 fois les mêmes blocs
function WorkflowCard({
  image,
  title,
  text,
}: {
  image: any;
  title: string;
  text: string;
}) {
  return (
    <a
      className="group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:bg-indigo-500 after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500 hover:after:opacity-20 group-hover:before:opacity-100"
      href="#0"
    >
      <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:inset-0 after:bg-gradient-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50">
        {/* Arrow */}
        <div
          className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/65 text-gray-200 opacity-0 transition-opacity group-hover/card:opacity-100"
          aria-hidden="true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={9} height={8} fill="none">
            <path
              fill="#F4F4F5"
              d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"
            />
          </svg>
        </div>
        {/* Image */}
        <Image className="inline-flex" src={image} width={350} height={288} alt={title} />
        {/* Content */}
        <div className="p-6">
          <div className="mb-3">
            <span className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-gray-700/.15),--theme(--color-gray-700/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-gray-800/60">
              <span className="animate-[gradient_8s_linear_infinite] bg-[linear-gradient(to_right,#4f46e5,#8b5cf6,#ec4899,#4f46e5)] bg-clip-text text-transparent">
                {title}
              </span>
            </span>
          </div>
          <p className="text-indigo-200/65">{text}</p>
        </div>
      </div>
    </a>
  );
}
