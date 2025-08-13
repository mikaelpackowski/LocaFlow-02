import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type Role = "owner" | "tenant";

const USERS = [
  {
    id: "owner-1",
    name: "Propriétaire Test",
    email: "owner@test.com",
    password: "test1234",
    role: "owner" as Role,
  },
  {
    id: "tenant-1",
    name: "Locataire Test",
    email: "tenant@test.com",
    password: "test1234",
    role: "tenant" as Role,
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "LocaFlow Demo",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        role: { label: "Rôle", type: "text", placeholder: "owner|tenant" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "").toLowerCase().trim();
        const password = String(credentials?.password || "");
        // NB: pour le test, on compare en clair (pas de bcrypt ici)
        const user = USERS.find(
          (u) => u.email.toLowerCase() === email && u.password === password
        );
        if (!user) return null;
        // Tu peux aussi forcer le rôle si fourni par le formulaire
        // mais on s'en tient au rôle de l'utilisateur de test
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        } as any;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role as Role;
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role as Role | undefined;
      return session;
    },
  },
  pages: {
    // on garde ta page custom /auth/login
    signIn: "/auth/login",
  },
  // Important en prod
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
