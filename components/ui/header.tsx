// components/ui/header.tsx (Server Component)
import HeaderClient from "./header-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth"; // ← adapte si ton fichier s’appelle autrement

export default async function Header() {
  const session = await getServerSession(authOptions);
  return <HeaderClient session={session} />;
}
