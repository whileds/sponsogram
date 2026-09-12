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

    const { topic, niche } = await req.json();

    if (!topic?.trim()) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const creator = await prisma.creatorProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      );
    }

    const text = `${topic} ${niche || creator.niche}`.toLowerCase();

    const hashtags = new Set<string>();

    hashtags.add("#ContentCreator");
    hashtags.add("#CreatorTips");

    if (text.includes("ai") || text.includes("chatgpt")) {
      hashtags.add("#AI");
      hashtags.add("#AITools");
      hashtags.add("#ChatGPT");
      hashtags.add("#ArtificialIntelligence");
    }

    if (
      text.includes("tech") ||
      text.includes("technology") ||
      text.includes("software")
    ) {
      hashtags.add("#Tech");
      hashtags.add("#TechTrends");
      hashtags.add("#TechCreator");
    }

    if (
      text.includes("fitness") ||
      text.includes("gym") ||
      text.includes("workout")
    ) {
      hashtags.add("#Fitness");
      hashtags.add("#Workout");
      hashtags.add("#FitnessCreator");
    }

    if (
      text.includes("fashion") ||
      text.includes("style") ||
      text.includes("outfit")
    ) {
      hashtags.add("#Fashion");
      hashtags.add("#Style");
      hashtags.add("#FashionCreator");
    }

    if (
      text.includes("business") ||
      text.includes("entrepreneur") ||
      text.includes("startup")
    ) {
      hashtags.add("#Business");
      hashtags.add("#Entrepreneur");
      hashtags.add("#Startup");
    }

    hashtags.add("#Reels");
    hashtags.add("#InstagramReels");

    return NextResponse.json({
      hashtags: Array.from(hashtags).slice(0, 15),
    });
  } catch (error) {
    console.error("Hashtag generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate hashtags" },
      { status: 500 }
    );
  }
}