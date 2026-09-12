import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const allowedRoles = ["ADMIN", "MANAGER"];

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const applications = await prisma.brandApplication.findMany({
      include: {
        creatorProfile: {
          include: {
            user: true,
          },
        },
        campaign: {
          include: {
            brand: true,
          },
        },
      },
      orderBy: {
        appliedAt: "desc",
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Brand applications GET error:", error);

    return NextResponse.json(
      { error: "Failed to load brand applications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { applicationId, status } = await req.json();

    const validStatuses = [
      "APPLIED",
      "SHORTLISTED",
      "ACCEPTED",
      "REJECTED",
    ];

    if (!applicationId || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid application or status" },
        { status: 400 }
      );
    }

    const application = await prisma.brandApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("Brand application PATCH error:", error);

    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}