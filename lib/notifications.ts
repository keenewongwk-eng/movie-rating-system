import { prisma } from "./prisma";

export type NotificationType =
  | "movie_create"
  | "movie_update"
  | "rating_create"
  | "rating_update"
  | "reply_create"
  | "user_create"
  | "user_update";

interface CreateNotificationParams {
  type: NotificationType;
  message: string;
  entityId?: string;
  entityType?: "movie" | "rating" | "user";
  metadata?: Record<string, any>;
}

export async function createNotification({
  type,
  message,
  entityId,
  entityType,
  metadata,
}: CreateNotificationParams) {
  try {
    await prisma.notification.create({
      data: {
        type,
        message,
        entityId,
        entityType,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    // 不拋出錯誤，避免影響主要操作
  }
}

export async function getNotifications(limit: number = 50) {
  return await prisma.notification.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

