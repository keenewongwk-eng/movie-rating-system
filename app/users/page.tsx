"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

// 判斷是否為圖片 URL（base64 或 http/https）
const isImageUrl = (icon: string): boolean => {
  return (
    icon.startsWith("data:image/") ||
    icon.startsWith("http://") ||
    icon.startsWith("https://")
  );
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditIcon(user.icon);
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditName("");
    setEditIcon("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 驗證文件類型
    if (!file.type.startsWith("image/")) {
      alert("請選擇圖片文件");
      return;
    }

    // 驗證文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert("圖片大小不能超過 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setEditIcon(data.url);
      } else {
        const error = await response.json();
        alert(error.error || "上傳失敗");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("上傳失敗");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (userId: string) => {
    if (!editName.trim()) {
      alert("請輸入用戶名稱");
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName.trim(),
          icon: editIcon || "😊",
        }),
      });

      if (response.ok) {
        await fetchUsers();
        setEditingUserId(null);
        setEditName("");
        setEditIcon("");
      } else {
        const error = await response.json();
        alert(error.error || "更新失敗");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("更新失敗");
    }
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (
      !confirm(
        `確定要刪除用戶「${userName}」嗎？此操作無法復原，所有相關評分也會被刪除。`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || "刪除失敗");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("刪除失敗");
    }
  };

  const commonIcons = ["😊", "😎", "🐻", "🐨", "🤖", "👻", "🎭", "🦄"];

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-white">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">載入中...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 返回按鈕 */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6"
        >
          ← 返回電影列表
        </Link>

        {/* 標題 */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">用戶管理</h1>
          <p className="text-gray-400">管理所有用戶信息</p>
        </div>

        {/* 用戶列表 */}
        {users.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            還沒有用戶，快來創建第一個用戶吧！
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-surface rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                {editingUserId === user.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        用戶名稱
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm sm:text-base"
                        placeholder="用戶名稱"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        個人資料圖片
                      </label>

                      {/* 當前選擇的圖片預覽 */}
                      {editIcon && isImageUrl(editIcon) && (
                        <div className="mb-3 flex justify-center">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700">
                            <img
                              src={editIcon}
                              alt="預覽"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* 上傳圖片按鈕 */}
                      <div className="mb-3">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id={`file-input-${user.id}`}
                        />
                        <label
                          htmlFor={`file-input-${user.id}`}
                          className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm text-center cursor-pointer hover:bg-gray-700 transition-colors"
                        >
                          {uploading ? "上傳中..." : "上傳圖片 (1:1)"}
                        </label>
                      </div>

                      {/* Emoji 選擇 */}
                      <div className="mb-2">
                        <label className="block text-xs text-gray-400 mb-2">
                          或選擇 Emoji
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {commonIcons.map((icon) => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => setEditIcon(icon)}
                              className={`text-xl sm:text-2xl p-2 rounded-lg border-2 transition-colors ${
                                editIcon === icon && !isImageUrl(editIcon)
                                  ? "border-yellow-400 bg-yellow-400/20"
                                  : "border-gray-700 hover:border-gray-600"
                              }`}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(user.id)}
                        className="flex-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <div className="flex justify-center mb-2">
                        {isImageUrl(user.icon) ? (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-700">
                            <img
                              src={user.icon}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="text-4xl sm:text-5xl">
                            {user.icon}
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold break-words">
                        {user.name}
                      </h3>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 mb-4 text-center">
                      創建於{" "}
                      {new Date(user.createdAt).toLocaleDateString("zh-TW")}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        編輯
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      >
                        刪除
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
