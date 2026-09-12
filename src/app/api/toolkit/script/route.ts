import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CREATOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const topic = String(body.topic ?? "").trim();
    const tone = String(body.tone ?? "").trim();

    if (!topic) {
      return NextResponse.json(
        { error: "Video topic is required" },
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
        { error: "You need an active plan to use the AI Toolkit" },
        { status: 403 }
      );
    }

    const monthlyLimit =
      creator.subscription.plan.toolkitCreditsPerMonth;

    // Premium/unlimited plans
    if (monthlyLimit === null) {
      // Continue without credit restriction
    } else {
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

      const usedCredits = usage._sum.creditsUsed ?? 0;

      if (usedCredits >= monthlyLimit) {
        return NextResponse.json(
          {
            error: `Your monthly toolkit limit of ${monthlyLimit} credits has been reached`,
          },
          { status: 403 }
        );
      }
    }

    /*
     * Temporary local generation.
     * Later we can replace this section with OpenAI/another AI API.
     */
    const generatedScript = `🔥 HOOK (0-3s):
"Stop scrolling! Here's something about ${topic} that you probably didn't know."

📌 BODY (3-20s):
"Let's break down ${topic} in a simple way. I'll show you the most important points, why they matter, and how you can use them immediately."

🎯 CTA (20-30s):
"If you found this useful, follow for more content like this and comment below with your thoughts!"

Tone: ${tone || "High Energy & Hype"}`;

    // One script generation = 1 credit
    await prisma.toolkitUsage.create({
      data: {
        creatorProfileId: creator.id,
        tool: "SCRIPT_GENERATOR",
        creditsUsed: 1,
        inputSummary: topic.slice(0, 500),
      },
    });

    return NextResponse.json({
      script: generatedScript,
      creditsUsed: 1,
    });
  } catch (error) {
    console.error("Toolkit script generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    );
  }
}