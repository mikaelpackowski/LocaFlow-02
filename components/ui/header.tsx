"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isOwner = session?.user?.role === "owner";
  const isTenant = session?.user?.role === "tenant";

  return (
    <header
      id="site-header"
      className="fixed top-0 left-0 z-50 w-full border-b bg-white/90 backdrop-blur md:h-16"
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo => accueil */}
        <Link href="/" className="text-xl font-bold text-gray-900">
          ForGesty
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/annonces" className="hover:text-violet-600">
            Annonces
          </Link>
          <Link href="/tarifs" className="hover:text-violet-600">
            Tarifs
          </Link>
          <Link href="/faq" className="hover:text-violet-600">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-violet-600">
            Contact
          </Link>

          {/* Espace à droite : Compte */}
          {!session ? (
            <Link
              href="/auth/login"
              className="rounded-full bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500"
            >
              Se connecter
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-2 hover:bg-gray-50"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
                Compte
                <svg
                  className={`h-4 w-4 transition ${accountOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 0 1 .94 1.17l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.4a.75.75 0 0 1 .02-1.19Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border bg-white shadow-lg">
                  <div className="px-4 py-3 text-sm">
                    <p className="font-semibold text-gray-900">
                      {session.user?.name ?? session.user?.email}
                    </p>
                    <p className="text-gray-500">{session.user?.role ?? "Utilisateur"}</p>
                  </div>
                  <div className="border-t" />

                  {/* Liens dynamiques */}
                  <div className="py-1 text-sm">
                    {isOwner && (
                      <>
                        <Link href="/proprietaire/dashboard" className="block px-4 py-2 hover:bg-gray-50">
                          Tableau de bord propriétaire
                        </Link>
                        <Link href="/proprietaire/problemes" className="block px-4 py-2 hover:bg-gray-50">
                          Gérer un problème
                        </Link>
                      </>
                    )}
                    {isTenant && (
                      <>
                        <Link href="/locataire/dashboard" className="block px-4 py-2 hover:bg-gray-50">
                          Tableau de bord locataire
                        </Link>
                        <Link href="/locataire/probleme" className="block px-4 py-2 hover:bg-gray-50">
                          Signaler un problème
                        </Link>
                      </>
                    )}
                    <Link href="/profil" className="block px-4 py-2 hover:bg-gray-50">
                      Mon profil
                    </Link>
                  </div>

                  <div className="border-t" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Burger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded md:hidden focus:outline-none focus:ring-2 focus:ring-violet-500"
          aria-label="Ouvrir/fermer le menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="h-6 w-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav className="space-y-3 border-t bg-white px-4 py-3 text-sm md:hidden">
          <Link href="/annonces" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
            Annonces
          </Link>
          <Link href="/tarifs" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
            Tarifs
          </Link>
          <Link href="/faq" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
            FAQ
          </Link>
          <Link href="/contact" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          {!session ? (
            <Link
              href="/auth/login"
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-violet-600 px-4 py-2 font-semibold text-white hover:bg-violet-500"
              onClick={() => setMenuOpen(false)}
            >
              Se connecter
            </Link>
          ) : (
            <>
              {isOwner && (
                <>
                  <Link href="/proprietaire/dashboard" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                    Tableau de bord propriétaire
                  </Link>
                  <Link href="/proprietaire/problemes" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                    Gérer un problème
                  </Link>
                </>
              )}
              {isTenant && (
                <>
                  <Link href="/locataire/dashboard" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                    Tableau de bord locataire
                  </Link>
                  <Link href="/locataire/probleme" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                    Signaler un problème
                  </Link>
                </>
              )}
              <Link href="/profil" className="block hover:text-violet-600" onClick={() => setMenuOpen(false)}>
                Mon profil
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="mt-2 w-full rounded-full border px-4 py-2 text-left hover:bg-gray-50"
              >
                Se déconnecter
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
