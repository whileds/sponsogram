import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (
    !session?.user ||
    !["ADMIN", "MANAGER", "MENTOR"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const managers = await prisma.managerProfile.findMany({
    include: {
      user: true,
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  return NextResponse.json(
    managers.map((manager) => ({
      id: manager.id,
      name: manager.user.name,
      email: manager.user.email,
      title: manager.title,
    }))
  );
}