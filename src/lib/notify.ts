import { prisma } from "@/lib/prisma";

type NotificationType =
  | "application_submitted"
  | "application_approved"
  | "application_rejected"
  | "application_waitlisted"
  | "editing_request_updated"
  | "brand_application_updated"
  | "mentorship_booking_confirmed"
  | "manager_update"
  | "mentor_update";

interface NotifyInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
}

/**
 * Writes an in-app notification row and (best-effort) sends an email if
 * RESEND_API_KEY is configured. Never throws — a failed notification should
 * never fail the request that triggered it.
 */
export async function sendNotification({ userId, type, title, body }: NotifyInput) {
  try {
    await prisma.notification.create({
      data: { userId, type, title, body },
    });
  } catch (err) {
    console.error("Failed to write notification:", err);
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.NOTIFICATIONS_FROM_EMAIL ?? "noreply@sponsogram.com",
            to: user.email,
            subject: title,
            text: body,
          }),
        });
      }
    } catch (err) {
      console.error("Failed to send notification email:", err);
    }
  }
}
