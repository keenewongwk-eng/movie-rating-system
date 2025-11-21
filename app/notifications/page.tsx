"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  message: string;
  entityId: string | null;
  entityType: string | null;
  metadata: any;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications?limit=100");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "movie_create":
        return "🎬";
      case "movie_update":
        return "✏️";
      case "rating_create":
        return "⭐";
      case "rating_update":
        return "🔄";
      case "reply_create":
        return "💬";
      case "user_create":
        return "👤";
      case "user_update":
        return "👤";
      default:
        return "📝";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "movie_create":
        return "bg-blue-600/20 border-blue-600/30";
      case "movie_update":
        return "bg-yellow-600/20 border-yellow-600/30";
      case "rating_create":
        return "bg-green-600/20 border-green-600/30";
      case "rating_update":
        return "bg-orange-600/20 border-orange-600/30";
      case "reply_create":
        return "bg-purple-600/20 border-purple-600/30";
      case "user_create":
        return "bg-pink-600/20 border-pink-600/30";
      case "user_update":
        return "bg-indigo-600/20 border-indigo-600/30";
      default:
        return "bg-gray-600/20 border-gray-600/30";
    }
  };

  const getEntityLink = (notification: Notification) => {
    if (!notification.entityId || !notification.entityType) return null;

    switch (notification.entityType) {
      case "movie":
        return `/movies/${notification.entityId}`;
      case "rating":
        // 從 metadata 中獲取 movieId（如果有的話）
        if (notification.metadata?.movieId) {
          return `/movies/${notification.metadata.movieId}`;
        }
        return null;
      case "user":
        return `/users`;
      default:
        return null;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "剛剛";
    if (diffMins < 60) return `${diffMins} 分鐘前`;
    if (diffHours < 24) return `${diffHours} 小時前`;
    if (diffDays < 7) return `${diffDays} 天前`;
    return date.toLocaleDateString("zh-TW");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">載入中...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 標題和返回按鈕 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">📢 活動通知</h1>
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            返回首頁
          </Link>
        </div>

        {/* 統計信息 */}
        <div className="bg-surface rounded-lg p-4 mb-6 border border-gray-700">
          <div className="text-sm text-gray-400">
            共 {notifications.length} 條通知
          </div>
        </div>

        {/* 通知列表 */}
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            還沒有任何活動記錄
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const link = getEntityLink(notification);
              const NotificationContent = (
                <div
                  className={`bg-surface rounded-lg p-4 border ${getNotificationColor(
                    notification.type
                  )} ${
                    link
                      ? "hover:bg-gray-800/50 cursor-pointer transition-colors"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white mb-1">{notification.message}</p>
                      <div className="text-xs text-gray-400">
                        {formatTime(notification.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );

              return link ? (
                <Link key={notification.id} href={link}>
                  {NotificationContent}
                </Link>
              ) : (
                <div key={notification.id}>{NotificationContent}</div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

