import { NextResponse } from "next/server";

export async function GET() {
  try {
    await import("@/auth");

    return NextResponse.json({
      authImport: "OK",
      AUTH_SECRET: !!process.env.AUTH_SECRET,
      DATABASE_URL: !!process.env.DATABASE_URL,
    });
  } catch (error) {
    return NextResponse.json({
      authImport: "FAILED",
      errorName: error instanceof Error ? error.name : "Unknown",
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : null,
    });
  }
}