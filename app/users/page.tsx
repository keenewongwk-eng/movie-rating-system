"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  badRecommendationsCount: number; // 新增字段
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

  // 新增用戶的狀態
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("😊");
  const [creating, setCreating] = useState(false);
  const newFileInputRef = useRef<HTMLInputElement>(null);

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

  // 計算排行榜數據
  const rankingList = users
    .filter((u) => u.badRecommendationsCount > 0)
    .sort((a, b) => b.badRecommendationsCount - a.badRecommendationsCount);

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

  const uploadImage = async (file: File): Promise<string | null> => {
    // 驗證文件類型
    if (!file.type.startsWith("image/")) {
      alert("請選擇圖片文件");
      return null;
    }

    // 驗證文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert("圖片大小不能超過 5MB");
      return null;
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
        return data.url;
      } else {
        const error = await response.json();
        alert(error.error || "上傳失敗");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("上傳失敗");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleEditImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setEditIcon(url);
  };

  const handleNewImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setNewIcon(url);
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

  const handleCreateUser = async () => {
    if (!newName.trim()) {
      alert("請輸入用戶名稱");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName.trim(),
          icon: newIcon || "😊",
        }),
      });

      if (response.ok) {
        await fetchUsers();
        setShowCreateModal(false);
        setNewName("");
        setNewIcon("😊");
      } else {
        const error = await response.json();
        alert(error.error || "創建失敗");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("創建失敗");
    } finally {
      setCreating(false);
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

        {/* 標題和新增按鈕 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">用戶管理</h1>
            <p className="text-gray-400">管理所有用戶信息</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <span className="text-xl leading-none">+</span> 新增用戶
          </button>
        </div>

        {/* 伏片推薦王排行榜 */}
        {rankingList.length > 0 && (
          <div className="mb-10 bg-surface border border-red-900/50 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-red-900/20 px-6 py-4 border-b border-red-900/30 flex items-center gap-2">
              <span className="text-2xl">☠️</span>
              <h2 className="text-xl font-bold text-red-400">
                伏片推薦王排行榜
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/20 text-gray-400 text-sm">
                  <tr>
                    <th className="px-6 py-3 font-medium">排名</th>
                    <th className="px-6 py-3 font-medium">用戶</th>
                    <th className="px-6 py-3 font-medium text-right">
                      推薦伏片數量 (評分 &lt; 3.0)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {rankingList.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                            index === 0
                              ? "bg-yellow-500/20 text-yellow-500"
                              : index === 1
                              ? "bg-gray-400/20 text-gray-400"
                              : index === 2
                              ? "bg-orange-700/20 text-orange-700"
                              : "text-gray-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {isImageUrl(user.icon) ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600">
                              <img
                                src={user.icon}
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <span className="text-xl">{user.icon}</span>
                          )}
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-lg font-bold text-red-400">
                        {user.badRecommendationsCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                          onChange={handleEditImageUpload}
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
                      <div className="mb-1">
                        創建於{" "}
                        {new Date(user.createdAt).toLocaleDateString("zh-TW")}
                      </div>
                      {user.badRecommendationsCount > 0 && (
                        <div className="text-red-400 font-semibold">
                          推薦伏片: {user.badRecommendationsCount} 部
                        </div>
                      )}
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

      {/* 新增用戶彈出對話框 */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div className="bg-surface rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">新增用戶</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  用戶名稱
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="請輸入用戶名稱"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  個人資料圖片
                </label>

                {/* 當前選擇的圖片預覽 */}
                {newIcon && isImageUrl(newIcon) ? (
                  <div className="mb-3 flex justify-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700">
                      <img
                        src={newIcon}
                        alt="預覽"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 flex justify-center">
                    <div className="text-6xl">{newIcon}</div>
                  </div>
                )}

                {/* 上傳圖片按鈕 */}
                <div className="mb-3">
                  <input
                    ref={newFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleNewImageUpload}
                    className="hidden"
                    id="new-file-input"
                  />
                  <label
                    htmlFor="new-file-input"
                    className="block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm text-center cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    {uploading ? "上傳中..." : "上傳圖片 (1:1)"}
                  </label>
                </div>

                {/* Emoji 選擇 */}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">
                    或選擇 Emoji
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {commonIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setNewIcon(icon)}
                        className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                          newIcon === icon && !isImageUrl(newIcon)
                            ? "border-green-500 bg-green-500/20"
                            : "border-gray-700 hover:border-gray-600"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateUser}
                  disabled={creating || uploading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-colors font-medium"
                >
                  {creating ? "創建中..." : "創建用戶"}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
