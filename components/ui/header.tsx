"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const user = session?.user;
  const role = (user as any)?.role as "owner" | "tenant" | undefined; // si tu ajoutes role dans la session
  const displayName = user?.name || user?.email?.split("@")[0] || "Utilisateur";
  const avatarInitial = displayName.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo -> Accueil (nom inchangé) */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600"
        >
          <span>Forgesty</span>
        </Link>

        {/* Liens simples (desktop) */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/annonces" className="hover:text-blue-600">Annonces</Link>
          <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </nav>

        {/* Zone Compte (desktop) */}
        <div className="hidden items-center md:flex">
          {status !== "authenticated" ? (
            <Link
              href="/auth/login"
              className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Se connecter
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setAccountOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-gray-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-sm">
                  {avatarInitial}
                </span>
                <span className="text-gray-800">Compte</span>
                <svg
                  className={`h-4 w-4 text-gray-500 transition ${accountOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {accountOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-56 rounded-xl border bg-white p-2 shadow-lg">
                  <div className="px-3 py-2 text-xs text-gray-500">
                    Connecté en tant que
                    <div className="truncate font-medium text-gray-900">{displayName}</div>
                    {role && (
                      <div className="mt-0.5 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[11px] uppercase tracking-wide text-gray-600">
                        {role === "owner" ? "Propriétaire" : "Locataire"}
                      </div>
                    )}
                  </div>
                  <div className="my-2 h-px bg-gray-100" />

                  {/* Liens selon rôle */}
                  {role === "tenant" ? (
                    <>
                      <MenuLink href="/locataire/dashboard">Dashboard locataire</MenuLink>
                      <MenuLink href="/locataire/probleme">Signaler un problème</MenuLink>
                      <MenuLink href="/locataire/paiements">Mes paiements</MenuLink>
                    </>
                  ) : role === "owner" ? (
                    <>
                      <MenuLink href="/proprietaire/dashboard">Dashboard propriétaire</MenuLink>
                      <MenuLink href="/proprietaire/problemes">Gérer un problème</MenuLink>
                      <MenuLink href="/proprietaire/biens">Mes biens</MenuLink>
                    </>
                  ) : (
                    <>
                      <MenuLink href="/locataire/dashboard">Espace locataire</MenuLink>
                      <MenuLink href="/proprietaire/dashboard">Espace propriétaire</MenuLink>
                    </>
                  )}

                  <div className="my-2 h-px bg-gray-100" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
            {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav className="space-y-3 border-t bg-white px-4 py-3 text-sm md:hidden">
          <Link href="/annonces" className="block hover:text-blue-600">Annonces</Link>
          <Link href="/faq" className="block hover:text-blue-600">FAQ</Link>
          <Link href="/contact" className="block hover:text-blue-600">Contact</Link>

          <div className="my-2 h-px bg-gray-100" />

          {status !== "authenticated" ? (
            <Link
              href="/auth/login"
              className="block rounded-lg bg-gray-900 px-4 py-2 text-center font-semibold text-white hover:bg-black"
            >
              Se connecter
            </Link>
          ) : (
            <div className="space-y-1">
              {role === "tenant" ? (
                <>
                  <Link href="/locataire/dashboard" className="block rounded-lg px-3 py-2 hover:bg-gray-50">
                    Dashboard locataire
                  </Link>
                  <Link href="/locataire/probleme" className="block rounded-lg px-3 py-2 hover:bg-gray-50">
                    Signaler un problème
                  </Link>
                  <Link href="/locataire/paiements" className="block rounded-lg px-3 py-2 hover:bg-gray-50">
                    Mes paiements
                  </Link>
                </>
              ) : role === "owner" ? (
                <>
                  <Link href="/proprietaire/dashboard" className="block rounded-lg px-3 py-2 hover:bg-gray-50">
                    Dashboard propriétaire
                  </Link>
                  <Link href="/proprietaire/problemes" className="block rounded-lg px-3 py-2 hover:bg-gray-50">
                    Gérer un problème
                  </Link>
                  <Link href="/proprietaire/biens" className="block rounded-lg px-3 py-2 hover:bg-gray-50">
                    Mes biens
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/locataire/dashboard" className="block rounded-lg px-3 py-2 hover:bg-gray-50">
                    Espace locataire
                  </Link>
                  <Link href="/proprietaire/dashboard" className="block rounded-lg px-3 py-2 hover:bg-gray-50">
                    Espace propriétaire
                  </Link>
                </>
              )}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="mt-2 block w-full rounded-lg bg-gray-100 px-3 py-2 text-left hover:bg-gray-200"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50" role="menuitem">
      {children}
    </Link>
  );
}
