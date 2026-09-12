import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "CREATOR") {
      return NextResponse.json({ error: "Creators only" }, { status: 403 });
    }

    const { hookTitle } = await req.json();

    if (!hookTitle?.trim()) {
      return NextResponse.json(
        { error: "Hook title is required" },
        { status: 400 }
      );
    }

    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        subscription: {
          include: {
            plan: true,
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

    // Simple rule-based virality score for now.
    // Later we can replace this with an actual AI model.
    let score = 50;
    const text = hookTitle.trim();

    if (text.length >= 20) score += 10;
    if (text.length >= 40) score += 5;

    const curiosityWords = [
      "why",
      "how",
      "secret",
      "stop",
      "mistake",
      "truth",
      "before",
      "never",
      "nobody",
      "hidden",
      "shocking",
      "actually",
    ];

    const lowerText = text.toLowerCase();

    curiosityWords.forEach((word) => {
      if (lowerText.includes(word)) score += 4;
    });

    if (text.includes("?")) score += 5;
    if (text.includes("!")) score += 3;

    score = Math.min(score, 100);

    let level = "Low Viral Potential";

    if (score >= 80) {
      level = "High Viral Potential";
    } else if (score >= 60) {
      level = "Medium Viral Potential";
    }

    return NextResponse.json({
      score,
      level,
    });
  } catch (error) {
    console.error("Virality prediction error:", error);

    return NextResponse.json(
      { error: "Failed to predict virality" },
      { status: 500 }
    );
  }
}