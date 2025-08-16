// auth.ts (racine du repo)
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const {
  handlers: { GET, POST }, // pour /api/auth/[...nextauth]
  auth,                     // pour lire la session côté serveur
  signIn, signOut,         // helpers côté serveur
} = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
        role: { label: "Role", type: "text", value: "tenant" }, // optionnel
      },
      async authorize(credentials) {
        // ⚠️ Démo : accepte tout couple non vide
        if (credentials?.email && credentials.password) {
          return {
            id: "demo-user",
            name: "Démo",
            email: String(credentials.email),
            role: (credentials as any).role ?? "tenant",
          } as any;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = (user as any).role ?? token.role ?? "tenant";
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.role = (token as any).role ?? "tenant";
      return session;
    },
  },
});
