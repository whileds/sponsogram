import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerCreatorSchema } from "@/lib/validation/application";
import { sendNotification } from "@/lib/notify";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const formData = await req.formData();

  const profilePhoto = formData.get("profilePhoto") as File | null;

  const body = {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
    socialHandle: String(formData.get("socialHandle") ?? ""),
    platform: String(formData.get("platform") ?? ""),
    niche: String(formData.get("niche") ?? ""),
    followerCount: String(formData.get("followerCount") ?? ""),
    requestedPlan: String(formData.get("requestedPlan") ?? ""),
    primaryGoal: String(formData.get("primaryGoal") ?? ""),
  };

  const parsed = registerCreatorSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    fullName,
    email,
    password,
    socialHandle,
    platform,
    niche,
    followerCount,
    requestedPlan,
    primaryGoal,
  } = parsed.data;

  if (!profilePhoto || profilePhoto.size === 0) {
    return NextResponse.json(
      { error: "Profile photo is required" },
      { status: 400 }
    );
  }

  if (profilePhoto.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Profile photo must be smaller than 5MB" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  // Upload photo to Cloudinary
  const bytes = await profilePhoto.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "sponsogram/creators",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        name: fullName,
        role: "CREATOR",
        avatarUrl: uploadResult.secure_url,
      },
    });

    const creatorProfile = await tx.creatorProfile.create({
      data: {
        userId: user.id,
        socialHandle,
        platform,
        niche,
        followerCount,
        primaryGoal,
      },
    });

    const application = await tx.application.create({
      data: {
        creatorProfileId: creatorProfile.id,
        fullName,
        email,
        requestedPlan,
      },
    });

    return { user, application };
  });

  await sendNotification({
    userId: result.user.id,
    type: "application_submitted",
    title: "Application submitted",
    body: "Your CIP application has been received and is under review.",
  });

  return NextResponse.json(
    {
      message: "Application submitted",
      applicationId: result.application.id,
    },
    { status: 201 }
  );
}