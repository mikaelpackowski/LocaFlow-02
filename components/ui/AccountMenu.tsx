"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type SessionLike = {
  loggedIn: boolean;
  role: "owner" | "tenant" | null;
  name?: string;
  email?: string;
};

function readSession(): SessionLike {
  // Lecture "soft" dans localStorage ou cookies (fallback)
  if (typeof window === "undefined") return { loggedIn: false, role: null };
  try {
    const raw = localStorage.getItem("lf_session");
    if (raw) return JSON.parse(raw);
  } catch {}
  // cookies fallback (lf_session=1; lf_role=owner|tenant; lf_name=...)
  const cookies = Object.fromEntries(
    document.cookie.split(";").map(c => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("=") ?? "")];
    }),
  );
  const role = (cookies["lf_role"] as "owner" | "tenant" | undefined) ?? null;
  return {
    loggedIn: cookies["lf_session"] === "1" && !!role,
    role: role ?? null,
    name: cookies["lf_name"] || undefined,
    email: cookies["lf_email"] || undefined,
  };
}

function clearSession() {
  try {
    localStorage.removeItem("lf_session");
  } catch {}
  // clear cookies
  const expire = "Thu, 01 Jan 1970 00:00:00 GMT";
  ["lf_session", "lf_role", "lf_name", "lf_email"].forEach((k) => {
    document.cookie = `${k}=; expires=${expire}; path=/`;
  });
}

export default function AccountMenu() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<SessionLike>({ loggedIn: false, role: null });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSession(readSession());
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const avatarLabel =
    session.name?.charAt(0).toUpperCase() ??
    (session.role === "owner" ? "P" : session.role === "tenant" ? "L" : "C");

  return (
    <div className="relative" ref={ref}>
      {/* Bouton compte */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium hover:bg-gray-50"
      >
        {/* Icône/avatar */}
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white text-xs">
          {avatarLabel}
        </span>
        <span>Compte</span>
        <svg
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.586l3.71-3.356a.75.75 0 1 1 1.02 1.1l-4.22 3.82a.75.75 0 0 1-1.02 0l-4.22-3.82a.75.75 0 0 1 .02-1.1z" />
        </svg>
      </button>

      {/* Menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-white shadow-lg"
        >
          {!session.loggedIn ? (
            <div className="p-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeWidth="2" d="M15 3h4a2 2 0 0 1 2 2v4M10 14l-4-4m0 0 4-4m-4 4h12" />
                </svg>
                Se connecter
              </Link>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/proprietaire/inscription"
                  className="rounded-lg border px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 text-center"
                  onClick={() => setOpen(false)}
                >
                  Créer compte propriétaire
                </Link>
                <Link
                  href="/locataire/inscription"
                  className="rounded-lg border px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 text-center"
                  onClick={() => setOpen(false)}
                >
                  Créer compte locataire
                </Link>
              </div>
            </div>
          ) : session.role === "owner" ? (
            <div className="p-2">
              <div className="px-3 py-2 text-xs text-gray-500">Connecté en <b>Propriétaire</b></div>
              <Link href="/proprietaire/dashboard" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setOpen(false)}>
                Tableau de bord
              </Link>
              <Link href="/proprietaire/annonces" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setOpen(false)}>
                Mes annonces
              </Link>
              <Link href="/proprietaire/paiements" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setOpen(false)}>
                Paiements
              </Link>
              <button
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                onClick={() => {
                  clearSession();
                  setOpen(false);
                  location.reload();
                }}
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="p-2">
              <div className="px-3 py-2 text-xs text-gray-500">Connecté en <b>Locataire</b></div>
              <Link href="/locataire/dashboard" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setOpen(false)}>
                Tableau de bord
              </Link>
              <Link href="/locataire/dossier" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setOpen(false)}>
                Mon dossier
              </Link>
              <Link href="/locataire/paiements" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50" onClick={() => setOpen(false)}>
                Paiements
              </Link>
              <button
                className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                onClick={() => {
                  clearSession();
                  setOpen(false);
                  location.reload();
                }}
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
