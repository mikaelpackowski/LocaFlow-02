"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Tu peux ajouter des options ici si besoin (refetchInterval, etc.)
  return <SessionProvider>{children}</SessionProvider>;
}
