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

  const requests = await prisma.editingRequest.findMany({
    orderBy: {
      submittedAt: "desc",
    },
    include: {
      creatorProfile: {
        include: {
          user: true,
        },
      },
    },
  });

  return NextResponse.json(
    requests.map((request) => ({
      id: request.id,
      title: request.title,
      rawFootageUrl: request.rawFootageUrl,
      instructions: request.instructions,
      format: request.format,
      status: request.status,
      assignedEditor: request.assignedEditor,
      progress: request.progress,
      finalVideoUrl: request.finalVideoUrl,
      submittedAt: request.submittedAt,
      creator: {
        id: request.creatorProfile.id,
        name: request.creatorProfile.user.name,
        email: request.creatorProfile.user.email,
      },
    }))
  );
}

export async function PATCH(req: Request) {
  const session = await auth();

  if (
    !session?.user ||
    !["ADMIN", "MANAGER"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.id) {
    return NextResponse.json(
      { error: "Editing request ID is required" },
      { status: 400 }
    );
  }

  const data: {
    assignedEditor?: string | null;
    status?: "SUBMITTED" | "IN_REVIEW" | "EDITING" | "READY" | "COMPLETED";
    progress?: number;
    finalVideoUrl?: string | null;
  } = {};

  if ("assignedEditor" in body) {
    data.assignedEditor = body.assignedEditor || null;
  }

  if ("status" in body) {
    data.status = body.status;
  }

  if ("progress" in body) {
    data.progress = Math.max(0, Math.min(100, Number(body.progress)));
  }

  if ("finalVideoUrl" in body) {
    data.finalVideoUrl = body.finalVideoUrl || null;
  }

  const updated = await prisma.editingRequest.update({
    where: { id: body.id },
    data,
  });

  return NextResponse.json({
    success: true,
    request: updated,
  });
}