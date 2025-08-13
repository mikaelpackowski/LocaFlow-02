import HeaderClient from "./header-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export default async function Header() {
  const session = await getServerSession(authOptions);
  return <HeaderClient session={session} />;
}
