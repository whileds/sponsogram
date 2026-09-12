import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CREATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creator = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      editingRequests: {
        orderBy: { submittedAt: "desc" },
      },
      subscription: {
        include: { plan: true },
      },
    },
  });

  if (!creator) {
    return NextResponse.json(
      { error: "Creator profile not found" },
      { status: 404 }
    );
  }

  const editors = await prisma.editorProfile.findMany({
    include: {
      user: true,
    },
  });

  const editorMap = new Map(
    editors.map((editor) => [editor.id, editor.user.name])
  );

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const videosThisWeek = creator.editingRequests.filter(
    (request) => request.submittedAt >= weekStart
  ).length;

  return NextResponse.json({
    tasks: creator.editingRequests.map((request) => ({
      id: request.id,
      title: request.title,
      format: request.format,
      rawLink: request.rawFootageUrl,
      editor: request.assignedEditor
        ? editorMap.get(request.assignedEditor) ?? "Assigned Editor"
        : "Assigned Queue",
      status: request.status,
      progress: request.progress,
      downloadUrl: request.finalVideoUrl,
      submittedDate: request.submittedAt.toISOString(),
    })),
    quota: {
      used: videosThisWeek,
      limit: creator.subscription?.plan.videoEditsPerWeek ?? 0,
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CREATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const title = String(body.title ?? "").trim();
  const rawLink = String(body.rawLink ?? "").trim();
  const format = String(body.format ?? "").trim();

  if (!title || !rawLink || !format) {
    return NextResponse.json(
      { error: "Title, raw footage link and format are required" },
      { status: 400 }
    );
  }

  if (!["Reels / Shorts", "Long-Form Video"].includes(format)) {
    return NextResponse.json(
      { error: "Invalid video format" },
      { status: 400 }
    );
  }

  const creator = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      subscription: {
        include: { plan: true },
      },
    },
  });

  if (!creator) {
    return NextResponse.json(
      { error: "Creator profile not found" },
      { status: 404 }
    );
  }

  if (!creator.subscription) {
    return NextResponse.json(
      { error: "You need an active plan before submitting a video" },
      { status: 403 }
    );
  }

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const videosThisWeek = await prisma.editingRequest.count({
    where: {
      creatorProfileId: creator.id,
      submittedAt: {
        gte: weekStart,
      },
    },
  });

  const limit = creator.subscription.plan.videoEditsPerWeek;

  if (videosThisWeek >= limit) {
    return NextResponse.json(
      {
        error: `Your weekly editing limit of ${limit} videos has been reached`,
      },
      { status: 403 }
    );
  }

  const request = await prisma.editingRequest.create({
    data: {
      creatorProfileId: creator.id,
      title,
      rawFootageUrl: rawLink,
      format,
      status: "SUBMITTED",
      progress: 0,
    },
  });

  return NextResponse.json(
    {
      message: "Video submitted successfully",
      task: {
        id: request.id,
        title: request.title,
        format: request.format,
        rawLink: request.rawFootageUrl,
        editor: "Assigned Queue",
        status: request.status,
        progress: request.progress,
        submittedDate: request.submittedAt.toISOString(),
      },
    },
    { status: 201 }
  );
}