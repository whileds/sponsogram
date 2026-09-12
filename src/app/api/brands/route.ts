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
    });

    if (!creator) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      );
    }

    const campaigns = await prisma.brandCampaign.findMany({
      where: {
        isActive: true,
      },
      include: {
        brand: true,
        applications: {
          where: {
            creatorProfileId: creator.id,
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    const deals = campaigns.map((campaign) => ({
      id: campaign.id,
      brandName: campaign.brand.name,
      logo: campaign.brand.logoUrl,
      niche: campaign.brand.niche,
      payout: `₹${(campaign.payoutInPaise / 100).toLocaleString("en-IN")}`,
      deliverables: campaign.deliverables,
      deadline: campaign.deadline.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      applied: campaign.applications.length > 0,
      applicationStatus: campaign.applications[0]?.status ?? null,
    }));

    return NextResponse.json({
      deals,
      creatorNiche: creator.niche,
    });
  } catch (error) {
    console.error("Brands API error:", error);

    return NextResponse.json(
      { error: "Failed to load brand campaigns" },
      { status: 500 }
    );
  }
}