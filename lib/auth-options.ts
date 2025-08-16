// lib/auth-options.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
        role:     { label: "Role", type: "text" }, // "owner" | "tenant" (optionnel)
      },
      async authorize(credentials) {
        // ⚠️ Démo : accepte tout couple non vide
        if (credentials?.email && credentials.password) {
          return {
            id: "demo-user",
            name: "Démo",
            email: String(credentials.email),
            // @ts-ignore
            role: credentials.role === "owner" ? "owner" : "tenant",
          } as any;
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // propage le rôle dans le token
        // @ts-ignore
        token.role = (user as any).role ?? token.role ?? "tenant";
      }
      return token;
    },
    async session({ session, token }) {
      // expose le rôle en session côté client
      // @ts-ignore
      session.role = (token as any).role ?? "tenant";
      return session;
    },
  },
};
