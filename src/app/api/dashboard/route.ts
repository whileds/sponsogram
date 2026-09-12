import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CREATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creator = await prisma.creatorProfile.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      user: true,
      subscription: {
        include: {
          plan: true,
        },
      },
      editingRequests: true,
      brandApplications: true,
      toolkitUsage: true,
      manager: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!creator) {
    return NextResponse.json(
      { error: "Creator profile not found" },
      { status: 404 }
    );
  }

  const videosEdited = creator.editingRequests.filter(
    (request) => request.status === "COMPLETED"
  ).length;

  const videosQueued = creator.editingRequests.filter(
    (request) =>
      request.status !== "COMPLETED"
  ).length;

  const brandSponsorships = creator.brandApplications.filter(
    (application) => application.status === "ACCEPTED"
  ).length;

  return NextResponse.json({
    user: {
      name: creator.user.name,
      package: creator.subscription?.plan.name ?? null,
      manager: creator.manager
        ? {
            name: creator.manager.user.name,
            avatar: creator.manager.user.avatarUrl ?? null,
            role: creator.manager.title ?? "Creator Growth Manager",
          }
        : null,
    },

    stats: {
      videosEdited,
      videosQueued,
      brandSponsorships,

      // No views/earnings model exists in the current Prisma schema.
      totalViews: 0,
      securedEarnings: 0,

      toolkitUsage: creator.toolkitUsage.length,
    },

    editingRequests: creator.editingRequests.map((request) => ({
      id: request.id,
      title: request.title,
      format: request.format,
      status: request.status,
      progress: request.progress,
      assignedEditor: request.assignedEditor,
      finalVideoUrl: request.finalVideoUrl,
    })),
  });
}