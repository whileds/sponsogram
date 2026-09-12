-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CREATOR', 'MANAGER', 'MENTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('CREATOR_LITE', 'CREATOR_PLUS', 'CREATOR_PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE');

-- CreateEnum
CREATE TYPE "EditingStatus" AS ENUM ('SUBMITTED', 'IN_REVIEW', 'EDITING', 'READY', 'COMPLETED');

-- CreateEnum
CREATE TYPE "BrandApplicationStatus" AS ENUM ('APPLIED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MentorshipBookingStatus" AS ENUM ('BOOKED', 'COMPLETED', 'CANCELED', 'RESCHEDULED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CREATOR',
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "socialHandle" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "followerCount" TEXT NOT NULL,
    "primaryGoal" TEXT,
    "managerId" TEXT,
    "mentorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManagerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "expertise" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "requestedPlan" "PlanTier" NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewedById" TEXT,
    "reviewNote" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "tier" "PlanTier" NOT NULL,
    "name" TEXT NOT NULL,
    "monthlyPriceInPaise" INTEGER NOT NULL,
    "quarterlyPriceInPaise" INTEGER NOT NULL,
    "toolkitCreditsPerMonth" INTEGER,
    "videoEditsPerWeek" INTEGER NOT NULL,
    "brandApplicationsPerMonth" INTEGER,
    "mentorshipFrequencyDays" INTEGER NOT NULL,
    "matchmakingPriority" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "billingCycle" TEXT NOT NULL,
    "razorpaySubscriptionId" TEXT,
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "amountInPaise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolkitUsage" (
    "id" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "tool" TEXT NOT NULL,
    "creditsUsed" INTEGER NOT NULL,
    "inputSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolkitUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditingRequest" (
    "id" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "rawFootageUrl" TEXT NOT NULL,
    "instructions" TEXT,
    "format" TEXT NOT NULL,
    "status" "EditingStatus" NOT NULL DEFAULT 'SUBMITTED',
    "assignedEditor" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "finalVideoUrl" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EditingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentStrategyItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "hookText" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "viewsPotential" TEXT NOT NULL,
    "viralityReason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ContentStrategyItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "niche" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandCampaign" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "payoutInPaise" INTEGER NOT NULL,
    "deliverables" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BrandCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandApplication" (
    "id" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "status" "BrandApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatorMatch" (
    "id" TEXT NOT NULL,
    "creatorAId" TEXT NOT NULL,
    "creatorBId" TEXT NOT NULL,
    "proposedFormat" TEXT NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipAvailability" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MentorshipAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorshipBooking" (
    "id" TEXT NOT NULL,
    "creatorProfileId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "availabilityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "MentorshipBookingStatus" NOT NULL DEFAULT 'BOOKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorshipBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_userId_key" ON "CreatorProfile"("userId");

-- CreateIndex
CREATE INDEX "CreatorProfile_managerId_idx" ON "CreatorProfile"("managerId");

-- CreateIndex
CREATE INDEX "CreatorProfile_mentorId_idx" ON "CreatorProfile"("mentorId");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerProfile_userId_key" ON "ManagerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorProfile_userId_key" ON "MentorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_creatorProfileId_key" ON "Application"("creatorProfileId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_tier_key" ON "Plan"("tier");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_creatorProfileId_key" ON "Subscription"("creatorProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_razorpaySubscriptionId_key" ON "Subscription"("razorpaySubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "ToolkitUsage_creatorProfileId_createdAt_idx" ON "ToolkitUsage"("creatorProfileId", "createdAt");

-- CreateIndex
CREATE INDEX "EditingRequest_creatorProfileId_status_idx" ON "EditingRequest"("creatorProfileId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BrandApplication_creatorProfileId_campaignId_key" ON "BrandApplication"("creatorProfileId", "campaignId");

-- CreateIndex
CREATE INDEX "CreatorMatch_creatorAId_idx" ON "CreatorMatch"("creatorAId");

-- CreateIndex
CREATE INDEX "CreatorMatch_creatorBId_idx" ON "CreatorMatch"("creatorBId");

-- CreateIndex
CREATE INDEX "MentorshipAvailability_mentorId_startsAt_idx" ON "MentorshipAvailability"("mentorId", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "MentorshipBooking_availabilityId_key" ON "MentorshipBooking"("availabilityId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "ManagerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerProfile" ADD CONSTRAINT "ManagerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolkitUsage" ADD CONSTRAINT "ToolkitUsage_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditingRequest" ADD CONSTRAINT "EditingRequest_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandCampaign" ADD CONSTRAINT "BrandCampaign_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandApplication" ADD CONSTRAINT "BrandApplication_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandApplication" ADD CONSTRAINT "BrandApplication_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "BrandCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorMatch" ADD CONSTRAINT "CreatorMatch_creatorAId_fkey" FOREIGN KEY ("creatorAId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorMatch" ADD CONSTRAINT "CreatorMatch_creatorBId_fkey" FOREIGN KEY ("creatorBId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipAvailability" ADD CONSTRAINT "MentorshipAvailability_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipBooking" ADD CONSTRAINT "MentorshipBooking_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipBooking" ADD CONSTRAINT "MentorshipBooking_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorshipBooking" ADD CONSTRAINT "MentorshipBooking_availabilityId_fkey" FOREIGN KEY ("availabilityId") REFERENCES "MentorshipAvailability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
