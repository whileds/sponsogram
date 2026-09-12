import type { NextAuthConfig } from "next-auth";

// This config is intentionally free of any Prisma/Node-only imports.
// It's used by middleware.ts, which runs on the Edge runtime — Prisma
// Client cannot run there. The full config (with the Prisma adapter and
// Credentials provider) lives in src/auth.ts and is used everywhere else
// (API routes, Server Components, Server Actions), all of which run on
// the Node.js runtime.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [], // real providers are only needed where sign-in happens (src/auth.ts)
  callbacks: {
    // Re-hydrates role/id onto the session object read from the JWT cookie.
    // This mirrors the jwt/session callbacks in src/auth.ts so middleware
    // can read session.user.role without touching the database.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as never;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
