"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const loggedIn = status === "authenticated";
  const role = (session?.user as any)?.role as "owner" | "tenant" | undefined;

  const dashboardHref =
    role === "tenant"
      ? "/locataire/dashboard"
      : "/proprietaire/dashboard";

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo vers l'accueil */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600"
        >
          <span>LocaFlow</span>
        </Link>

        {/* Liens principaux (simplifiés) */}
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
        </nav>

        {/* Bouton Compte */}
        <div className="relative">
          {/* Non connecté → simple bouton Se connecter */}
          {!loggedIn ? (
            <button
              onClick={() => signIn(undefined, { callbackUrl: "/" })}
              className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Se connecter
            </button>
          ) : (
            <>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                  {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </span>
                <span className="hidden sm:inline text-gray-800">
                  Mon compte
                </span>
                <svg
                  className={`ml-1 h-4 w-4 text-gray-500 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border bg-white py-2 shadow-xl"
                  role="menu"
                >
                  <div className="px-4 pb-2 text-xs uppercase tracking-wide text-gray-500">
                    Connecté en{" "}
                    <span className="font-semibold">
                      {role === "tenant" ? "Locataire" : "Propriétaire"}
                    </span>
                  </div>

                  <Link
                    href={dashboardHref}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Tableau de bord
                  </Link>

                  <Link
                    href="/annonces"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Annonces
                  </Link>

                  <Link
                    href="/compte"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    Mon compte
                  </Link>

                  <button
                    className="mt-1 block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
