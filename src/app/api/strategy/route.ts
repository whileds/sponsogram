import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "CREATOR") {
      return NextResponse.json({ error: "Creators only" }, { status: 403 });
    }

    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
      include: {
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

    const niche = creator.niche || "Tech & AI";
    const managerName = creator.manager?.user?.name || "Your Manager";

    const strategies = [
      {
        id: "strat-1",
        title: "The Secret Software Hook",
        hookText: `Stop using [Popular App]! This free ${niche} tool does the exact same thing in 5 seconds...`,
        niche,
        viewsPotential: "500k - 2M Views",
        viralityReason: "High curiosity gap + immediate utility.",
      },
      {
        id: "strat-2",
        title: "The Reality Check Hook",
        hookText: `If you're interested in ${niche}, watch this before making your next decision...`,
        niche,
        viewsPotential: "800k - 3M Views",
        viralityReason: "High emotional stakes + pattern interrupt.",
      },
      {
        id: "strat-3",
        title: "The Before & After Hook",
        hookText: `I tried this ${niche} strategy for 30 days and here is what happened...`,
        niche,
        viewsPotential: "400k - 1.5M Views",
        viralityReason: "Transformation + visual progression format.",
      },
    ];

    return NextResponse.json({
      manager: {
        name: managerName,
      },
      strategies,
      session: {
        day: "Friday",
        time: "4:00 PM",
      },
      feedback: {
        title: `Latest Reel Performance Notes from ${managerName}`,
        evaluatedOn: "July 19, 2026",
        note: "Your recent content is showing stronger retention. Keep opening with a direct question or strong pattern interrupt instead of a long introduction.",
      },
    });
  } catch (error) {
    console.error("Strategy API error:", error);

    return NextResponse.json(
      { error: "Failed to load strategy data" },
      { status: 500 }
    );
  }
}