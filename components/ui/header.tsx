"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      {/* Logo */}
      <Link href="/" className="text-lg font-bold text-gray-900">
        ForGesty
      </Link>

      {/* Navigation principale */}
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/annonces" className="text-gray-700 hover:text-gray-900">Annonces</Link>
        <Link href="/tarifs" className="text-gray-700 hover:text-gray-900">Tarifs</Link>
        <Link href="/faq" className="text-gray-700 hover:text-gray-900">FAQ</Link>
        <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
      </nav>

      {/* Menu utilisateur */}
      <div className="relative">
        {session ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-full bg-purple-600 text-white px-3 py-1 text-sm font-medium hover:bg-purple-500"
            >
              {session.user?.name?.charAt(0) || "U"}
              <span>Compte</span>
              <span className="ml-1">▾</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user?.name || "Démonstration"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.user?.email || "utilisateur@example.com"}
                  </p>
                </div>

                <div className="py-1">
                  {/* 👉 Nouveau bouton Dashboard */}
                  <Link
                    href="/proprietaire/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Tableau de bord
                  </Link>

                  <Link
                    href="/compte/abonnement"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Abonnement & factures
                  </Link>

                  <Link
                    href="/profil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mon profil
                  </Link>
                </div>

                <div className="border-t py-1">
                  <button
                    onClick={() => signOut()}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-full bg-purple-600 px-4 py-2 text-white text-sm font-medium hover:bg-purple-500"
          >
            Se connecter
          </Link>
        )}
      </div>
    </header>
  );
}
