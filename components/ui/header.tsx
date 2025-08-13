"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession(); // ← se met à jour après login/logout
  const [open, setOpen] = useState(false);

  const role = (session as any)?.user?.role as "owner" | "tenant" | undefined;

  const dashboardLinks =
    role === "owner"
      ? [
          { href: "/proprietaire/dashboard", label: "Tableau de bord" },
          { href: "/proprietaire/biens", label: "Mes biens" },
          { href: "/proprietaire/candidatures", label: "Candidatures" },
          { href: "/proprietaire/paiements", label: "Paiements" },
          { href: "/proprietaire/documents", label: "Documents" },
          { href: "/proprietaire/parametres", label: "Paramètres" },
        ]
      : [
          { href: "/locataire/dashboard", label: "Tableau de bord" },
          { href: "/locataire/dossier", label: "Mon dossier" },
          { href: "/locataire/visites", label: "Visites & candidatures" },
          { href: "/locataire/paiements", label: "Paiements" },
          { href: "/locataire/documents", label: "Documents" },
          { href: "/locataire/parametres", label: "Paramètres" },
        ];

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo / Accueil */}
        <Link href="/" className="text-xl font-bold text-gray-900">
          LocaFlow
        </Link>

        {/* Liens principaux */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/annonces" className="hover:text-indigo-600">
            Annonces
          </Link>
          <Link href="/faq" className="hover:text-indigo-600">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-indigo-600">
            Contact
          </Link>
        </nav>

        {/* Bouton Compte */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            aria-expanded={open}
          >
            {/* Pastille/initiales si connecté */}
            {status === "authenticated" ? (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs">
                {session?.user?.name?.[0]?.toUpperCase() ??
                  session?.user?.email?.[0]?.toUpperCase() ??
                  "C"}
              </span>
            ) : (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-700 text-xs">
                ?
              </span>
            )}
            <span>Compte</span>
            <svg
              className="h-4 w-4 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {/* Menu déroulant */}
          {open && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-xl border bg-white p-2 shadow-lg"
              onMouseLeave={() => setOpen(false)}
            >
              {status !== "authenticated" ? (
                <div className="p-2">
                  <button
                    onClick={() => {
                      setOpen(false);
                      signIn(undefined, { callbackUrl: "/" });
                    }}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Se connecter
                  </button>
                </div>
              ) : (
                <>
                  <div className="px-3 py-2 text-xs text-gray-500">
                    Connecté en{" "}
                    <span className="font-medium text-gray-800">
                      {role === "owner" ? "Propriétaire" : "Locataire"}
                    </span>
                  </div>

                  <ul className="max-h-[60vh] space-y-1 overflow-auto p-1">
                    {dashboardLinks.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-2 border-t p-2">
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
