// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "owner" | "tenant";
  }
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "owner" | "tenant";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "owner" | "tenant";
  }
}
