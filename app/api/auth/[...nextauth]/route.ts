// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // Démo : accepte toute combinaison non vide
        if (credentials?.email && credentials?.password) {
          return {
            id: "demo-user",
            name: "Demo",
            email: credentials.email as string,
          };
        }
        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

// ✅ N’exporte que les handlers HTTP
export { handler as GET, handler as POST };
