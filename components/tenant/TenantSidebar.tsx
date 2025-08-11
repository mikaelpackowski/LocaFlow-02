// components/tenant/TenantSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { key: "dashboard", label: "Tableau de bord", href: "/locataire/dashboard" },
  { key: "dossier", label: "Dossier numérique", href: "/locataire/dashboard/dossier" },
  { key: "visites", label: "Visites & candidatures", href: "/locataire/dashboard/visites" },
  { key: "paiements", label: "Paiements", href: "/locataire/dashboard/paiements" },
  { key: "documents", label: "Documents", href: "/locataire/dashboard/documents" },
  { key: "parametres", label: "Paramètres", href: "/locataire/dashboard/parametres" },
];

export default function TenantSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 rounded-lg border bg-white p-4 shadow-sm md:block">
      <div className="mb-3 text-sm font-semibold text-gray-700">Espace locataire</div>
      <nav className="space-y-1">
        {links.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.key}
              href={l.href}
              className={`block rounded-md px-3 py-2 text-sm ${
                active
                  ? "bg-indigo-50 font-medium text-indigo-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
