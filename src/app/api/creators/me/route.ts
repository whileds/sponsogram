import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statusMap: Record<string, string> = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  WAITLISTED: "waitlisted",
};

const planLabelMap: Record<string, "CREATOR LITE" | "CREATOR PLUS" | "CREATOR PREMIUM"> = {
  CREATOR_LITE: "CREATOR LITE",
  CREATOR_PLUS: "CREATOR PLUS",
  CREATOR_PREMIUM: "CREATOR PREMIUM",
};

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CREATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creatorProfile = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      application: true,
      subscription: { include: { plan: true } },
      manager: { include: { user: true } },
      mentor: { include: { user: true } },
    },
  });

  if (!creatorProfile) {
    return NextResponse.json({ error: "Creator profile not found" }, { status: 404 });
  }

  const activePlanTier =
    creatorProfile.subscription?.plan.tier ?? creatorProfile.application?.requestedPlan;

  const body = {
    id: creatorProfile.user.id,
    name: creatorProfile.user.name,
    email: creatorProfile.user.email,
    role: "creator" as const,
    avatar: creatorProfile.user.avatarUrl ?? undefined,
    package: activePlanTier ? planLabelMap[activePlanTier] : null,
    status: creatorProfile.application
      ? statusMap[creatorProfile.application.status]
      : null,
    socialHandle: creatorProfile.socialHandle,
    platform: creatorProfile.platform,
    niche: creatorProfile.niche,
    followerCount: creatorProfile.followerCount,
    assignedManager: creatorProfile.manager
      ? {
          name: creatorProfile.manager.user.name,
          email: creatorProfile.manager.user.email,
          avatar: creatorProfile.manager.user.avatarUrl ?? "",
          role: creatorProfile.manager.title ?? "Creator Growth Manager",
        }
      : null,
  };

  return NextResponse.json(body);
}
