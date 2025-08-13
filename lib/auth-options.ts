// lib/auth-options.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  // ⇩ Démo : provider "Credentials" ultra simple
  providers: [
    Credentials({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        role: { label: "Rôle", type: "text" }, // "owner" | "tenant"
      },
      async authorize(credentials) {
        // ⚠️ À remplacer plus tard par un vrai check DB
        if (
          credentials?.email &&
          credentials.password &&
          (credentials.role === "owner" || credentials.role === "tenant")
        ) {
          return {
            id: "demo-user",
            name: "Demo User",
            email: credentials.email,
            role: credentials.role, // on stocke le rôle
          } as any;
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // on copie le rôle dans le token
        token.role = (user as any).role ?? token.role;
      }
      return token;
    },
    async session({ session, token }) {
      // on expose le rôle côté session
      (session.user as any).role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/auth/login", // ta page de login
  },
};
