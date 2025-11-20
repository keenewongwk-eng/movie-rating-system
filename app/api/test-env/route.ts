import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const envPath = path.join(process.cwd(), ".env");
  const envLocalPath = path.join(process.cwd(), ".env.local");
  
  const envExists = fs.existsSync(envPath);
  const envLocalExists = fs.existsSync(envLocalPath);
  
  let envContent = "";
  let envLocalContent = "";
  
  if (envExists) {
    envContent = fs.readFileSync(envPath, "utf8");
  }
  
  if (envLocalExists) {
    envLocalContent = fs.readFileSync(envLocalPath, "utf8");
  }

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
    // 診斷信息
    diagnostics: {
      envFileExists: envExists,
      envLocalFileExists: envLocalExists,
      envFileHasDatabaseUrl: envContent.includes("DATABASE_URL"),
      envLocalFileHasDatabaseUrl: envLocalContent.includes("DATABASE_URL"),
      allEnvVars: Object.keys(process.env).filter(key => 
        key.includes("DATABASE") || key.includes("DB")
      ),
    },
  });
}
