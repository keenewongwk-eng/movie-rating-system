import { NextResponse } from "next/server";
import { getDatabaseUrl } from "@/lib/config";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const checks: Record<string, { status: string; message?: string }> = {};

  // 檢查環境變數
  try {
    const dbUrl = getDatabaseUrl();
    checks.databaseUrl = {
      status: dbUrl ? "ok" : "missing",
      message: dbUrl ? "Database URL is set" : "Database URL is not set",
    };
  } catch (error: any) {
    checks.databaseUrl = {
      status: "error",
      message: error.message,
    };
  }

  // 檢查數據庫連接
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.databaseConnection = {
      status: "ok",
      message: "Database connection successful",
    };
  } catch (error: any) {
    checks.databaseConnection = {
      status: "error",
      message: error.message,
    };
  }

  // 檢查 Prisma Client
  try {
    const movieCount = await prisma.movie.count();
    checks.prismaClient = {
      status: "ok",
      message: `Prisma Client working, found ${movieCount} movies`,
    };
  } catch (error: any) {
    checks.prismaClient = {
      status: "error",
      message: error.message,
    };
  }

  const allOk = Object.values(checks).every((check) => check.status === "ok");

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "unhealthy",
      checks,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
    { status: allOk ? 200 : 503 }
  );
}
