"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const { data: session, status } = useSession();

  const role = (session?.user as any)?.role === "tenant" ? "tenant" : (session?.user as any)?.role === "owner" ? "owner" : null;
  const dashboardHref = role === "owner" ? "/proprietaire/dashboard" : role === "tenant" ? "/locataire/dashboard" : "/auth/login";

  // Fermer les menus au clic d’un lien (mobile)
  const closeMenus = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600">
          <span>LocaFlow</span>
        </Link>

        {/* Menu desktop (garde tes liens) */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/annonces" className="hover:text-blue-600">Annonces</Link>
          <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>

          {/* Bouton Compte */}
          <div className="relative">
            {/* Si pas connecté → “Se connecter” */}
            {status !== "authenticated" ? (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                Se connecter
              </Link>
            ) : (
              // Si connecté → avatar + menu déroulant
              <>
                <button
                  onClick={() => setAcctOpen(v => !v)}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-2 font-medium text-gray-700 hover:bg-gray-50"
                  aria-haspopup="menu"
                  aria-expanded={acctOpen}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-sm">
                    {session?.user?.name?.[0]?.toUpperCase() ?? (role === "owner" ? "P" : role === "tenant" ? "L" : "U")}
                  </span>
                  Compte
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {acctOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl border bg-white p-2 shadow-lg"
                  >
                    <Link
                      href={dashboardHref}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setAcctOpen(false)}
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-[11px]">↗</span>
                      Accéder au tableau de bord
                    </Link>

                    <div className="my-2 h-px bg-gray-100" />

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full text-left rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </nav>

        {/* Burger (mobile) */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="rounded md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Ouvrir/fermer le menu"
          aria-expanded={menuOpen}
        >
          <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav className="space-y-3 border-t bg-white px-4 py-3 text-sm md:hidden">
          <Link href="/annonces" onClick={closeMenus} className="block hover:text-blue-600">Annonces</Link>
          <Link href="/faq" onClick={closeMenus} className="block hover:text-blue-600">FAQ</Link>
          <Link href="/contact" onClick={closeMenus} className="block hover:text-blue-600">Contact</Link>

          <div className="pt-2">
            {status !== "authenticated" ? (
              <Link
                href="/auth/login"
                onClick={closeMenus}
                className="block rounded-full border px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Se connecter
              </Link>
            ) : (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => { setMenuOpen(false); }}
                  className="block rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  Accéder au tableau de bord
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
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
