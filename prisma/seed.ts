import { PrismaClient, PlanTier, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- CIP Plans: source of truth for pricing + server-enforced limits ---
  // Replaces the static MONTHLY_PLANS/QUARTERLY_PLANS arrays in cipData.ts.
  await prisma.plan.upsert({
    where: { tier: PlanTier.CREATOR_LITE },
    update: {},
    create: {
      tier: PlanTier.CREATOR_LITE,
      name: "Creator Lite",
      monthlyPriceInPaise: 299900, // ₹2,999
      quarterlyPriceInPaise: 799900, // ₹7,999 (quarterly discount)
      toolkitCreditsPerMonth: 20,
      videoEditsPerWeek: 1,
      brandApplicationsPerMonth: 2,
      mentorshipFrequencyDays: 30, // monthly
      matchmakingPriority: false,
    },
  });

  await prisma.plan.upsert({
    where: { tier: PlanTier.CREATOR_PLUS },
    update: {},
    create: {
      tier: PlanTier.CREATOR_PLUS,
      name: "Creator Plus",
      monthlyPriceInPaise: 699900, // ₹6,999
      quarterlyPriceInPaise: 1899900,
      toolkitCreditsPerMonth: 60,
      videoEditsPerWeek: 3,
      brandApplicationsPerMonth: 8,
      mentorshipFrequencyDays: 14, // biweekly
      matchmakingPriority: true,
    },
  });

  await prisma.plan.upsert({
    where: { tier: PlanTier.CREATOR_PREMIUM },
    update: {},
    create: {
      tier: PlanTier.CREATOR_PREMIUM,
      name: "Creator Premium",
      monthlyPriceInPaise: 1299900, // ₹12,999
      quarterlyPriceInPaise: 3499900,
      toolkitCreditsPerMonth: null, // unlimited
      videoEditsPerWeek: 7,
      brandApplicationsPerMonth: null, // unlimited
      mentorshipFrequencyDays: 7, // weekly
      matchmakingPriority: true,
    },
  });

  // --- Demo admin account ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@sponsogram.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      name: "Platform Admin",
    },
  });

  console.log("Seed complete:");
  console.log("  - 3 CIP plans (Lite / Plus / Premium)");
  console.log(`  - Admin account: ${adminEmail} (password from SEED_ADMIN_PASSWORD)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
