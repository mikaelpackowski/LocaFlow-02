"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const isAuth = status === "authenticated";
  const role = (session?.user as any)?.role as "owner" | "tenant" | undefined;

  const dashboardHref =
    role === "owner"
      ? "/proprietaire/dashboard"
      : role === "tenant"
      ? "/locataire/dashboard"
      : "/"; // fallback

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-gray-800">
          LocaFlow
        </Link>

        {/* Liens simples */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/annonces" className="hover:text-blue-600">Annonces</Link>
          <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </nav>

        {/* Bouton Compte */}
        <div className="relative">
          {!isAuth ? (
            <button
              onClick={() => signIn(undefined, { callbackUrl: "/" })}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Se connecter
            </button>
          ) : (
            <>
              <button
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                <span className="inline-block h-6 w-6 rounded-full bg-indigo-600 text-white grid place-items-center">
                  {session?.user?.name?.[0]?.toUpperCase() ?? "C"}
                </span>
                Compte
              </button>

              {open && (
                <div
                  onMouseLeave={() => setOpen(false)}
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border bg-white shadow-lg"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {session?.user?.name ?? "Mon compte"}
                    </p>
                    <p className="text-xs text-gray-500 break-all">
                      {session?.user?.email}
                    </p>
                    {role && (
                      <p className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        rôle&nbsp;: {role === "owner" ? "propriétaire" : "locataire"}
                      </p>
                    )}
                  </div>

                  <div className="border-t">
                    <Link
                      href={dashboardHref}
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setOpen(false)}
                    >
                      Tableau de bord
                    </Link>

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
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
    </header>
  );
}
