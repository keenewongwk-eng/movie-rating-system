import { NextResponse } from "next/server";

export async function GET() {
  const hasDatabaseUrl = !!process.env.DATABASE_URL;
  const databaseUrlPreview = process.env.DATABASE_URL
    ? `${process.env.DATABASE_URL.substring(0, 30)}...`
    : "Not set";

  return NextResponse.json({
    hasDatabaseUrl,
    databaseUrlPreview,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    message: hasDatabaseUrl
      ? "✅ DATABASE_URL is loaded"
      : "❌ DATABASE_URL is not loaded",
  });
}

