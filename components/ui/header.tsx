"use client";

import { useState } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo cliquable -> Accueil */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600">
          <span>{SITE_NAME}</span>
        </Link>

        {/* Menu desktop */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/proprietaire" className="hover:text-blue-600">Propriétaire</Link>
          <Link href="/locataire" className="hover:text-blue-600">Locataire</Link>
          <Link href="/annonces" className="hover:text-blue-600">Annonces</Link>
          <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
          {/* Le bouton Compte/connexion reste tel que tu l’avais configuré avec NextAuth */}
        </nav>

        {/* Burger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
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
          <Link href="/proprietaire" onClick={closeMenu} className="block hover:text-blue-600">Propriétaire</Link>
          <Link href="/locataire" onClick={closeMenu} className="block hover:text-blue-600">Locataire</Link>
          <Link href="/annonces" onClick={closeMenu} className="block hover:text-blue-600">Annonces</Link>
          <Link href="/faq" onClick={closeMenu} className="block hover:text-blue-600">FAQ</Link>
          <Link href="/contact" onClick={closeMenu} className="block hover:text-blue-600">Contact</Link>
        </nav>
      )}
    </header>
  );
}
