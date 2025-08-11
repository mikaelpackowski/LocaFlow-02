"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo -> Accueil */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600">
          LocaFlow
        </Link>

        {/* Menu desktop */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/proprietaire" className="hover:text-blue-600">Propriétaire</Link>
          <Link href="/locataire" className="hover:text-blue-600">Locataire</Link>
          <Link href="/annonces" className="hover:text-blue-600">Annonces</Link>
          <Link href="/presentation" className="hover:text-blue-600">Découvrir LocaFlow</Link>
          <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>

          {/* Bouton compte */}
          <Link
            href="/auth/login"
            className="ml-2 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm hover:bg-gray-50"
            title="Mon compte"
          >
            {/* Icône compte */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="currentColor"/>
            </svg>
            Compte
          </Link>
        </nav>

        {/* Burger mobile */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Ouvrir/fermer le menu"
          aria-expanded={menuOpen}
        >
          <svg className="h-6 w-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav className="space-y-3 border-t bg-white px-4 py-3 text-sm md:hidden">
          <Link href="/proprietaire" onClick={closeMenu} className="block hover:text-blue-600">Propriétaire</Link>
          <Link href="/locataire" onClick={closeMenu} className="block hover:text-blue-600">Locataire</Link>
          <Link href="/annonces" onClick={closeMenu} className="block hover:text-blue-600">Annonces</Link>
          <Link href="/presentation" onClick={closeMenu} className="block hover:text-blue-600">Découvrir LocaFlow</Link>
          <Link href="/faq" onClick={closeMenu} className="block hover:text-blue-600">FAQ</Link>
          <Link href="/contact" onClick={closeMenu} className="block hover:text-blue-600">Contact</Link>
          <Link href="/auth/login" onClick={closeMenu} className="block rounded border px-3 py-2 hover:bg-gray-50">
            Mon compte
          </Link>
        </nav>
      )}
    </header>
  );
}
