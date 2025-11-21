import { NextResponse } from "next/server";
import { getNotifications } from "@/lib/notifications";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    const notifications = await getNotifications(limit);

    logger.info("Notifications fetched successfully", {
      count: notifications.length,
    });
    return NextResponse.json(notifications);
  } catch (error: any) {
    return handleApiError(error, {
      status: 500,
      message: "Failed to fetch notifications",
      route: "/api/notifications",
      method: "GET",
    });
  }
}
