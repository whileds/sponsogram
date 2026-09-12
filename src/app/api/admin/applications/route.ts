import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    orderBy: {
      submittedAt: "desc",
    },
    include: {
      creatorProfile: {
        include: {
          user: true,
          manager: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(
    applications.map((application) => ({
      id: application.id,
      name: application.fullName,
      email: application.email,
      socialHandle: application.creatorProfile.socialHandle,
      niche: application.creatorProfile.niche,
      followers: application.creatorProfile.followerCount,
      packageChoice: application.requestedPlan,
      status: application.status.toLowerCase(),

assignedManager:
  application.creatorProfile.manager?.user.name ?? "",

assignedManagerId:
  application.creatorProfile.manager?.id ?? "",
    }))
  );
}

export async function PATCH(req: Request) {
  const session = await auth();

  if (
    !session?.user ||
    !["ADMIN", "MANAGER", "MENTOR"].includes(session.user.role)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Manager assignment
  if (body.id && "managerId" in body) {
    const application = await prisma.application.findUnique({
      where: { id: body.id },
      select: {
        creatorProfile: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!application?.creatorProfile) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.creatorProfile.update({
      where: {
        id: application.creatorProfile.id,
      },
      data: {
        managerId: body.managerId || null,
      },
    });

    return NextResponse.json({
      success: true,
      managerId: updated.managerId,
    });
  }

  // Application status update
  if (!body.id || !["APPROVED", "REJECTED"].includes(body.status)) {
    return NextResponse.json(
      { error: "Invalid application update" },
      { status: 400 }
    );
  }

  const application = await prisma.application.update({
    where: {
      id: body.id,
    },
    data: {
      status: body.status,
    },
  });

  return NextResponse.json({
    success: true,
    id: application.id,
    status: application.status.toLowerCase(),
  });
}