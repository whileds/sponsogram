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
    return NextResponse.json({
      used: 0,
      limit: 0,
      remaining: 0,
      unlimited: false,
    });
  }

  const limit = creator.subscription.plan.toolkitCreditsPerMonth;

  const now = new Date();
  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const usage = await prisma.toolkitUsage.aggregate({
    where: {
      creatorProfileId: creator.id,
      createdAt: {
        gte: monthStart,
      },
    },
    _sum: {
      creditsUsed: true,
    },
  });

  const used = usage._sum.creditsUsed ?? 0;

  // null means unlimited
  if (limit === null) {
    return NextResponse.json({
      used,
      limit: null,
      remaining: null,
      unlimited: true,
    });
  }

  return NextResponse.json({
    used,
    limit,
    remaining: Math.max(limit - used, 0),
    unlimited: false,
  });
}