"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProprietaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* espace sous le header global (fixe) */}
      <div className="h-20 md:h-24" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-10">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={`transition-all duration-200 ${
              open ? "w-64" : "w-14"
            } sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border bg-white shadow-sm`}
          >
            <div className="flex items-center justify-between px-3 py-3 border-b">
              <span className={`text-sm font-semibold ${open ? "opacity-100" : "opacity-0"} transition-opacity`}>
                Espace propriétaire
              </span>
              <button
                onClick={() => setOpen((v) => !v)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Toggle sidebar"
              >
                {open ? "«" : "»"}
              </button>
            </div>

            <nav className="p-2 text-sm">
              <DashLink href="/proprietaire/dashboard" label="Tableau de bord" icon="📊" open={open} />
              <DashLink href="/proprietaire/biens" label="Mes biens" icon="🏠" open={open} />
              <DashLink href="/proprietaire/demandes" label="Candidatures" icon="📝" open={open} />
              <DashLink href="/proprietaire/paiements" label="Paiements" icon="💳" open={open} />
              <DashLink href="/proprietaire/documents" label="Documents" icon="📁" open={open} />
              <DashLink href="/proprietaire/parametres" label="Paramètres" icon="⚙️" open={open} />
            </nav>
          </aside>

          {/* Contenu */}
          <section className="flex-1">{children}</section>
        </div>
      </div>
    </div>
  );
}

function DashLink({
  href,
  label,
  icon,
  open,
}: {
  href: string;
  label: string;
  icon: string;
  open: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
    >
      <span className="text-base">{icon}</span>
      <span className={`${open ? "opacity-100" : "opacity-0"} transition-opacity`}>{label}</span>
    </Link>
  );
}
