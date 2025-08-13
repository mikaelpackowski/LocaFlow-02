"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import type { Session } from "next-auth";

export default function HeaderClient({ session }: { session: Session | null }) {
  const [open, setOpen] = useState(false);

  const role = (session?.user as any)?.role as "owner" | "tenant" | undefined;
  const isAuth = !!session;

  const dashboardHref =
    role === "owner" ? "/proprietaire/dashboard" :
    role === "tenant" ? "/locataire/dashboard" :
    "/";

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-gray-800">
          LocaFlow
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/annonces" className="hover:text-blue-600">Annonces</Link>
          <Link href="/faq" className="hover:text-blue-600">FAQ</Link>
          <Link href="/contact" className="hover:text-blue-600">Contact</Link>
        </nav>

        <div className="relative">
          {!isAuth ? (
            <Link
              href="/auth/login"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Se connecter
            </Link>
          ) : (
            <>
              <button
                onClick={() => setOpen(v => !v)}
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-600 text-white">
                  {session?.user?.name?.[0]?.toUpperCase() ?? "C"}
                </span>
                Compte
              </button>
              {open && (
                <div
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border bg-white shadow-lg"
                  onMouseLeave={() => setOpen(false)}
                >
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {session?.user?.name ?? "Mon compte"}
                    </p>
                    {session?.user?.email && (
                      <p className="break-all text-xs text-gray-500">
                        {session.user.email}
                      </p>
                    )}
                    {role && (
                      <p className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        rôle : {role === "owner" ? "propriétaire" : "locataire"}
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
