import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "EDITOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const editor = await prisma.editorProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!editor) {
    return NextResponse.json(
      { error: "Editor profile not found" },
      { status: 404 }
    );
  }

  const tasks = await prisma.editingRequest.findMany({
    where: {
      assignedEditor: editor.id,
    },
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
    tasks.map((task) => ({
      id: task.id,
      title: task.title,
      rawFootageUrl: task.rawFootageUrl,
      instructions: task.instructions,
      format: task.format,
      status: task.status,
      progress: task.progress,
      finalVideoUrl: task.finalVideoUrl,
      submittedAt: task.submittedAt,
      creator: {
        name: task.creatorProfile.user.name,
        email: task.creatorProfile.user.email,
      },
    }))
  );
}

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "EDITOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const editor = await prisma.editorProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!editor) {
    return NextResponse.json(
      { error: "Editor profile not found" },
      { status: 404 }
    );
  }

  const body = await req.json();

  if (!body.id) {
    return NextResponse.json(
      { error: "Editing request ID is required" },
      { status: 400 }
    );
  }

  // Security: make sure this task actually belongs to this editor
  const task = await prisma.editingRequest.findFirst({
    where: {
      id: body.id,
      assignedEditor: editor.id,
    },
  });

  if (!task) {
    return NextResponse.json(
      { error: "Task not assigned to you" },
      { status: 403 }
    );
  }

  const data: {
    status?: "SUBMITTED" | "IN_REVIEW" | "EDITING" | "READY" | "COMPLETED";
    progress?: number;
    finalVideoUrl?: string | null;
  } = {};

  if ("status" in body) {
    data.status = body.status;
  }

  if ("progress" in body) {
    data.progress = Math.max(
      0,
      Math.min(100, Number(body.progress))
    );
  }

  if ("finalVideoUrl" in body) {
    data.finalVideoUrl = body.finalVideoUrl || null;
  }

  const updated = await prisma.editingRequest.update({
    where: {
      id: task.id,
    },
    data,
  });

  return NextResponse.json({
    success: true,
    task: updated,
  });
}