import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";

// Maps a path prefix to the roles allowed to access it.
// `/dashboard` is shared by all authenticated roles (creator dashboard,
// but managers/mentors/admins can still be redirected appropriately by
// the page itself); admin-only and staff-only areas are locked down here.
const ROLE_PROTECTED_PREFIXES: { prefix: string; roles: Role[] }[] = [
  // The frontend only has one staff-facing page (/admin). Admin, Manager and
  // Mentor all land here; the page itself conditionally renders
  // admin-only controls (approve/reject applications, assign staff) based
  // on session.user.role, and every API route re-checks role server-side
  // regardless of what the UI shows.
  { prefix: "/admin", roles: ["ADMIN", "MANAGER", "MENTOR"] },
  { prefix: "/dashboard", roles: ["CREATOR"] },
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const match = ROLE_PROTECTED_PREFIXES.find((r) => pathname.startsWith(r.prefix));
  if (!match) return NextResponse.next();

  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!match.roles.includes(session.user.role)) {
    return NextResponse.redirect(new URL("/403", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
