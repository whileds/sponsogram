import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (
    !session?.user ||
    !["ADMIN", "MANAGER"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const editors = await prisma.editorProfile.findMany({
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
    editors.map((editor) => ({
      id: editor.id,
      name: editor.user.name,
      email: editor.user.email,
      title: editor.title,
    }))
  );
}