import { NextResponse } from "next/server";
import { getConfig, getDatabaseUrl } from "@/lib/config";

export async function GET() {
  try {
    const config = getConfig();
    const databaseUrl = getDatabaseUrl();
    const urlPreview = databaseUrl
      ? `${databaseUrl.substring(0, 30)}...`
      : "Not set";

    return NextResponse.json({
      success: true,
      message: "✅ Config loaded successfully",
      databaseUrlPreview: urlPreview,
      databaseUrlLength: databaseUrl.length,
      configExists: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "❌ Config loading failed",
        error: error.message,
        configExists: false,
      },
      { status: 500 }
    );
  }
}

