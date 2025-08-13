// lib/auth-options.ts
import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  // 👇 Utiliser ta page /auth/login, pas le formulaire NextAuth
  pages: {
    signIn: "/auth/login",
  },

  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        role: { label: "Rôle", type: "text" }, // "owner" | "tenant"
      },
      async authorize(credentials) {
        if (credentials?.email && credentials.password) {
          const role = credentials.role === "tenant" ? "tenant" : "owner";
          return {
            id: "demo-user",
            name: "Demo",
            email: String(credentials.email),
            role,
          } as any;
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user && (user as any).role) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role ?? "owner";
      return session;
    },
  },
};
