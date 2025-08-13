"use client";

import { Fragment, useMemo } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";

/** petit utilitaire pour des classes */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Initiales à partir du nom / email */
function initials(name?: string | null, email?: string | null) {
  const src = name || email || "";
  const parts = src.split(/[ .@_-]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || "U";
}

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user as (typeof session extends { user: infer U } ? U : any) | undefined;

  // On s’attend à ce que NextAuth mette le rôle sur user.role (owner | tenant).
  // On sécurise avec un fallback.
  const role = useMemo<"owner" | "tenant" | undefined>(() => {
    const r = (user as any)?.role;
    return r === "owner" || r === "tenant" ? r : undefined;
  }, [user]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo → Accueil */}
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-indigo-600">
          LocaFlow
        </Link>

        {/* Liens principaux (on reste simple comme convenu) */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/annonces" className="hover:text-indigo-600">
            Annonces
          </Link>
          <Link href="/faq" className="hover:text-indigo-600">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-indigo-600">
            Contact
          </Link>
        </nav>

        {/* Compte */}
        <div className="flex items-center gap-3">
          {/* État : non connecté */}
          {status !== "authenticated" && (
            <Link
              href="/auth/login"
              className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              Se connecter
            </Link>
          )}

          {/* État : connecté */}
          {status === "authenticated" && (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
                aria-label="Menu compte"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold"
                  aria-hidden
                >
                  {initials(user?.name as string, user?.email as string)}
                </span>
                <span className="hidden sm:inline text-gray-800">
                  {user?.name || user?.email || "Mon compte"}
                </span>
                <svg
                  className="h-4 w-4 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border bg-white p-2 shadow-lg focus:outline-none">
                  {/* Lien commun : Profil / Paramètres */}
                  <MenuLink href="/compte" label="Mon profil" />
                  <MenuSeparator />

                  {/* Raccourcis selon rôle */}
                  {role === "owner" ? (
                    <>
                      <MenuGroup label="Propriétaire" />
                      <MenuLink href="/proprietaire/dashboard" label="Tableau de bord" />
                      <MenuLink href="/proprietaire/biens" label="Mes biens" />
                      <MenuLink href="/proprietaire/depots" label="Déposer un bien" />
                      <MenuLink href="/proprietaire/paiements" label="Paiements" />
                      <MenuSeparator />
                    </>
                  ) : role === "tenant" ? (
                    <>
                      <MenuGroup label="Locataire" />
                      <MenuLink href="/locataire/dashboard" label="Tableau de bord" />
                      <MenuLink href="/locataire/candidatures" label="Mes candidatures" />
                      <MenuLink href="/locataire/visites" label="Mes visites" />
                      <MenuLink href="/locataire/paiements" label="Paiements" />
                      <MenuSeparator />
                    </>
                  ) : null}

                  {/* Déconnexion */}
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className={cn(
                          "w-full rounded-lg px-3 py-2 text-left text-sm font-medium",
                          active ? "bg-rose-50 text-rose-700" : "text-rose-600"
                        )}
                      >
                        Se déconnecter
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </div>
    </header>
  );
}

/* --- Petits composants de menu --- */

function MenuLink({ href, label }: { href: string; label: string }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <Link
          href={href}
          className={cn(
            "block rounded-lg px-3 py-2 text-sm",
            active ? "bg-gray-100 text-gray-900" : "text-gray-800"
          )}
        >
          {label}
        </Link>
      )}
    </Menu.Item>
  );
}

function MenuGroup({ label }: { label: string }) {
  return <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</div>;
}

function MenuSeparator() {
  return <div className="my-1 h-px w-full bg-gray-100" aria-hidden="true" />;
}
