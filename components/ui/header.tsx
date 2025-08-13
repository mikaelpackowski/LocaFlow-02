"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const nav = [
  { href: "/annonces", label: "Annonces" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);          // mobile menu
  const [acctOpen, setAcctOpen] = useState(false);  // desktop dropdown
  const acctRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!acctRef.current) return;
      if (!acctRef.current.contains(e.target as Node)) setAcctOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAcctOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-gray-900"
        >
          <span className="inline-block rounded-md bg-violet-600 px-2 py-1 text-white">
            L
          </span>
          <span>LocaFlow</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition ${
                isActive(item.href)
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Bouton Compte */}
          <div className="relative" ref={acctRef}>
            <button
              onClick={() => setAcctOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={acctOpen}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5ZM3 21a9 9 0 0 1 18 0v1H3Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Compte
              <svg className="h-4 w-4 opacity-70" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>

            {acctOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
              >
                <div className="p-2">
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-900 hover:bg-gray-50"
                    onClick={() => setAcctOpen(false)}
                    role="menuitem"
                  >
                    Se connecter
                  </Link>
                </div>
                <div className="border-t" />
                <div className="p-2">
                  <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Dashboards
                  </div>
                  <Link
                    href="/proprietaire/dashboard"
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setAcctOpen(false)}
                  >
                    Tableau de bord Propriétaire
                  </Link>
                  <Link
                    href="/locataire/dashboard"
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setAcctOpen(false)}
                  >
                    Tableau de bord Locataire
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Burger mobile */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="rounded-md p-2 md:hidden"
        >
          <svg className="h-6 w-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(item.href) ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 rounded-xl border bg-white">
              <div className="px-3 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Compte
              </div>
              <div className="p-2">
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-900 hover:bg-gray-50"
                >
                  Se connecter
                </Link>
                <div className="mt-2 rounded-lg bg-gray-50 p-2">
                  <div className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Dashboards
                  </div>
                  <Link
                    href="/proprietaire/dashboard"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard Propriétaire
                  </Link>
                  <Link
                    href="/locataire/dashboard"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard Locataire
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
