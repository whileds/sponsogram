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

    const { campaignId } = await req.json();

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    const creator = await prisma.creatorProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      );
    }

    const campaign = await prisma.brandCampaign.findUnique({
      where: {
        id: campaignId,
      },
    });

    if (!campaign || !campaign.isActive) {
      return NextResponse.json(
        { error: "Campaign is no longer available" },
        { status: 404 }
      );
    }

    const existingApplication = await prisma.brandApplication.findUnique({
      where: {
        creatorProfileId_campaignId: {
          creatorProfileId: creator.id,
          campaignId,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this campaign" },
        { status: 409 }
      );
    }

    const application = await prisma.brandApplication.create({
      data: {
        creatorProfileId: creator.id,
        campaignId,
      },
    });

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        status: application.status,
      },
    });
  } catch (error) {
    console.error("Brand application error:", error);

    return NextResponse.json(
      { error: "Failed to submit brand application" },
      { status: 500 }
    );
  }
}