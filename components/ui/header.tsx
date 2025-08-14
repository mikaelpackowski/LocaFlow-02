"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const role = session?.user?.role; // "owner" | "tenant" | undefined
  const isAuth = status === "authenticated";

  const closeAll = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo -> Accueil */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600"
          onClick={closeAll}
        >
          <span>LocaFlow</span>
        </Link>

        {/* Menu desktop */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/annonces" className="hover:text-blue-600">
            Annonces
          </Link>
          <Link href="/faq" className="hover:text-blue-600">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-blue-600">
            Contact
          </Link>

          {/* Compte (desktop) */}
          <div className="relative">
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              aria-haspopup="menu"
              aria-expanded={accountOpen}
            >
              <svg
                className="h-4 w-4 text-gray-700"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-3-3.87M7 7a4 4 0 1 0 10 0 4 4 0 0 0-10 0Z" />
                <path d="M4 21v-2a4 4 0 0 1 4-4h8" />
              </svg>
              <span>Compte</span>
            </button>

            {accountOpen && (
              <div
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border bg-white shadow-lg"
                role="menu"
              >
                {/* État de chargement */}
                {status === "loading" && (
                  <div className="px-4 py-3 text-sm text-gray-500">Chargement…</div>
                )}

                {/* Non connecté */}
                {!isAuth && status !== "loading" && (
                  <div className="p-2 text-sm">
                    <Link
                      href="/auth/login"
                      onClick={closeAll}
                      className="flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-gray-50"
                    >
                      Se connecter
                      <span className="text-xs text-gray-400">⌘L</span>
                    </Link>
                  </div>
                )}

                {/* Connecté */}
                {isAuth && (
                  <>
                    <div className="px-4 py-3 text-xs text-gray-500">
                      Connecté en tant que <span className="font-medium">{session?.user?.email}</span>
                      {role ? ` · ${role === "owner" ? "Propriétaire" : "Locataire"}` : ""}
                    </div>

                    {/* Liens selon rôle */}
                    {role === "owner" ? (
                      <div className="p-2 text-sm">
                        <Link
                          href="/proprietaire/dashboard"
                          onClick={closeAll}
                          className="block rounded-md px-3 py-2 hover:bg-gray-50"
                        >
                          Tableau de bord
                        </Link>
                        <Link
                          href="/proprietaire/biens"
                          onClick={closeAll}
                          className="block rounded-md px-3 py-2 hover:bg-gray-50"
                        >
                          Mes biens
                        </Link>
                        <Link
                          href="/proprietaire/biens/nouveau"
                          onClick={closeAll}
                          className="block rounded-md px-3 py-2 hover:bg-gray-50"
                        >
                          Publier un bien
                        </Link>
                        <Link
                          href="/proprietaire/locataires"
                          onClick={closeAll}
                          className="block rounded-md px-3 py-2 hover:bg-gray-50"
                        >
                          Locataires
                        </Link>
                        <button
                          onClick={() => {
                            closeAll();
                            signOut({ callbackUrl: "/" });
                          }}
                          className="mt-1 block w-full rounded-md px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
                        >
                          Se déconnecter
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 text-sm">
                        <Link
                          href="/locataire/dashboard"
                          onClick={closeAll}
                          className="block rounded-md px-3 py-2 hover:bg-gray-50"
                        >
                          Tableau de bord
                        </Link>
                        <Link
                          href="/locataire/dossier"
                          onClick={closeAll}
                          className="block rounded-md px-3 py-2 hover:bg-gray-50"
                        >
                          Mon dossier
                        </Link>
                        <Link
                          href="/locataire/visites"
                          onClick={closeAll}
                          className="block rounded-md px-3 py-2 hover:bg-gray-50"
                        >
                          Mes visites
                        </Link>
                        <Link
                          href="/locataire/paiements"
                          onClick={closeAll}
                          className="block rounded-md px-3 py-2 hover:bg-gray-50"
                        >
                          Paiements
                        </Link>
                        <button
                          onClick={() => {
                            closeAll();
                            signOut({ callbackUrl: "/" });
                          }}
                          className="mt-1 block w-full rounded-md px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
                        >
                          Se déconnecter
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Burger (mobile) */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Ouvrir/fermer le menu"
          aria-expanded={menuOpen}
        >
          <svg
            className="h-6 w-6 text-gray-800"
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

      {/* Menu mobile + compte */}
      {menuOpen && (
        <nav className="space-y-3 border-t bg-white px-4 py-3 text-sm md:hidden">
          <Link href="/annonces" onClick={closeAll} className="block hover:text-blue-600">
            Annonces
          </Link>
          <Link href="/faq" onClick={closeAll} className="block hover:text-blue-600">
            FAQ
          </Link>
          <Link href="/contact" onClick={closeAll} className="block hover:text-blue-600">
            Contact
          </Link>

          <div className="my-2 border-t pt-3">
            {!isAuth ? (
              <Link href="/auth/login" onClick={closeAll} className="block rounded-md border px-3 py-2 text-center hover:bg-gray-50">
                Se connecter
              </Link>
            ) : role === "owner" ? (
              <>
                <Link href="/proprietaire/dashboard" onClick={closeAll} className="block rounded-md px-3 py-2 hover:bg-gray-50">
                  Tableau de bord
                </Link>
                <Link href="/proprietaire/biens" onClick={closeAll} className="block rounded-md px-3 py-2 hover:bg-gray-50">
                  Mes biens
                </Link>
                <Link href="/proprietaire/biens/nouveau" onClick={closeAll} className="block rounded-md px-3 py-2 hover:bg-gray-50">
                  Publier un bien
                </Link>
                <Link href="/proprietaire/locataires" onClick={closeAll} className="block rounded-md px-3 py-2 hover:bg-gray-50">
                  Locataires
                </Link>
                <button
                  onClick={() => {
                    closeAll();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="mt-1 w-full rounded-md px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link href="/locataire/dashboard" onClick={closeAll} className="block rounded-md px-3 py-2 hover:bg-gray-50">
                  Tableau de bord
                </Link>
                <Link href="/locataire/dossier" onClick={closeAll} className="block rounded-md px-3 py-2 hover:bg-gray-50">
                  Mon dossier
                </Link>
                <Link href="/locataire/visites" onClick={closeAll} className="block rounded-md px-3 py-2 hover:bg-gray-50">
                  Mes visites
                </Link>
                <Link href="/locataire/paiements" onClick={closeAll} className="block rounded-md px-3 py-2 hover:bg-gray-50">
                  Paiements
                </Link>
                <button
                  onClick={() => {
                    closeAll();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="mt-1 w-full rounded-md px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
                >
                  Se déconnecter
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
