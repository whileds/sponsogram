import { z } from "zod";

export const registerCreatorSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required"),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    socialHandle: z.string().trim().min(1, "Social handle is required"),
    platform: z.string().trim().min(1, "Platform is required"),
    niche: z.string().trim().min(1, "Niche is required"),
    followerCount: z.string().trim().min(1, "Follower count is required"),
    requestedPlan: z.enum(["CREATOR_LITE", "CREATOR_PLUS", "CREATOR_PREMIUM"]),
    primaryGoal: z.string().trim().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterCreatorInput = z.infer<typeof registerCreatorSchema>;
