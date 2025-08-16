"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

type Role = "owner" | "tenant" | undefined;

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // fermer dropdown si clic à l’extérieur
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const role = (session?.user as any)?.role as Role;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo à gauche */}
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900 hover:opacity-90"
        >
          ForGesty
        </Link>

        {/* Nav + Compte à droite */}
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/annonces" className="text-gray-700 hover:text-indigo-600">Annonces</Link>
            <Link href="/faq" className="text-gray-700 hover:text-indigo-600">FAQ</Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600">Contact</Link>
          </nav>

          {/* Compte */}
          <div className="relative" ref={menuRef}>
            {!session?.user ? (
              <Link
                href="/auth/login"
                className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Se connecter
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-gray-50"
                  aria-haspopup="menu"
                  aria-expanded={open}
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                    {(session.user.name?.[0] || "U").toUpperCase()}
                  </span>
                  Compte
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="opacity-70">
                    <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>

                {open && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border bg-white shadow-lg"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm text-gray-500">Connecté en tant que</p>
                      <p className="truncate text-sm font-medium text-gray-900">
                        {session.user.email || session.user.name || "Utilisateur"}
                      </p>
                    </div>

                    <div className="py-1 text-sm">
                      {role === "tenant" && (
                        <>
                          <Link href="/locataire/dashboard" className="block px-4 py-2 hover:bg-gray-50">
                            Tableau de bord locataire
                          </Link>
                          <Link href="/locataire/probleme" className="block px-4 py-2 hover:bg-gray-50">
                            Signaler un problème
                          </Link>
                          <Link href="/locataire/visites" className="block px-4 py-2 hover:bg-gray-50">
                            Mes visites
                          </Link>
                          <Link href="/locataire/paiements" className="block px-4 py-2 hover:bg-gray-50">
                            Mes paiements
                          </Link>
                        </>
                      )}

                      {role === "owner" && (
                        <>
                          <Link href="/proprietaire/dashboard" className="block px-4 py-2 hover:bg-gray-50">
                            Tableau de bord propriétaire
                          </Link>
                          <Link href="/proprietaire/problemes" className="block px-4 py-2 hover:bg-gray-50">
                            Gérer un problème
                          </Link>
                          <Link href="/proprietaire/annonces" className="block px-4 py-2 hover:bg-gray-50">
                            Mes annonces
                          </Link>
                        </>
                      )}

                      <Link href="/compte" className="block px-4 py-2 hover:bg-gray-50">
                        Mon compte
                      </Link>
                    </div>

                    <div className="border-t p-2">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
