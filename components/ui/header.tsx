"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

// Optionnel: si tu ajoutes un rôle dans la session, tu peux le typer plus tard.
// declare module "next-auth" {
//   interface User { role?: "owner" | "tenant"; }
//   interface Session { user?: { role?: "owner" | "tenant"; email?: string | null } }
// }

export default function Header() {
  const { data: session, status } = useSession(); // 'loading' | 'authenticated' | 'unauthenticated'
  const [menuOpen, setMenuOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);

  const isAuth = status === "authenticated";
  const role = (session?.user as any)?.role as "owner" | "tenant" | undefined;
  const email = session?.user?.email ?? undefined;

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo / Accueil */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600">
          <span>LocaFlow</span>
        </Link>

        {/* Menu desktop */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/annonces" className="hover:text-blue-600">Annonces</Link>
          <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>

          {/* Compte */}
          <div className="relative">
            <button
              onClick={() => setAcctOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
              aria-haspopup="menu"
              aria-expanded={acctOpen}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-700">
                <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6Z" fill="currentColor" opacity=".25" />
                <path d="M21 24c0-4.97-4.03-9-9-9s-9 4.03-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">{isAuth ? (email || "Mon compte") : "Se connecter"}</span>
            </button>

            {acctOpen && (
              <div
                className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border bg-white shadow-xl"
                role="menu"
              >
                {!isAuth ? (
                  <div className="p-2">
                    <Link
                      href="/auth/login"
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setAcctOpen(false)}
                    >
                      Se connecter
                    </Link>
                    <div className="my-2 h-px bg-gray-100" />
                    <div className="px-3 py-2 text-xs text-gray-500">
                      Accédez ensuite à votre tableau de bord locataire ou propriétaire.
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    {role === "owner" ? (
                      <>
                        <Link
                          href="/proprietaire/dashboard"
                          className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setAcctOpen(false)}
                        >
                          Dashboard propriétaire
                        </Link>
                        <Link
                          href="/proprietaire/biens/nouveau"
                          className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setAcctOpen(false)}
                        >
                          Déposer un bien
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/locataire/dashboard"
                          className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setAcctOpen(false)}
                        >
                          Dashboard locataire
                        </Link>
                        <Link
                          href="/locataire/candidatures"
                          className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setAcctOpen(false)}
                        >
                          Mes candidatures
                        </Link>
                      </>
                    )}

                    <div className="my-2 h-px bg-gray-100" />
                    <button
                      onClick={() => { setAcctOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                    >
                      Se déconnecter
                    </button>
                  </div>
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
        >
          <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            {/* Icône burger */}
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Menu mobile simple */}
      {menuOpen && (
        <nav className="space-y-3 border-t bg-white px-4 py-3 text-sm md:hidden">
          <Link href="/annonces" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Annonces</Link>
          <Link href="/faq" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>FAQ</Link>
          <Link href="/contact" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>Contact</Link>
          <div className="h-px bg-gray-100" />
          {!isAuth ? (
            <Link href="/auth/login" className="block rounded-lg bg-gray-900 px-3 py-2 text-white" onClick={() => setMenuOpen(false)}>
              Se connecter
            </Link>
          ) : (
            <>
              {role === "owner" ? (
                <>
                  <Link href="/proprietaire/dashboard" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                    Dashboard propriétaire
                  </Link>
                  <Link href="/proprietaire/biens/nouveau" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                    Déposer un bien
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/locataire/dashboard" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                    Dashboard locataire
                  </Link>
                  <Link href="/locataire/candidatures" className="block hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                    Mes candidatures
                  </Link>
                </>
              )}
              <button
                onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                className="mt-2 w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50"
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
