"use client";

import { useState, useEffect } from "react";

interface AddMovieFormProps {
  onSuccess: () => void;
}

interface User {
  id: string;
  name: string;
  icon: string;
}

// 判斷是否為圖片 URL
const isImageUrl = (icon: string): boolean => {
  return (
    icon.startsWith("data:image/") ||
    icon.startsWith("http://") ||
    icon.startsWith("https://")
  );
};

export default function AddMovieForm({ onSuccess }: AddMovieFormProps) {
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRecommenderIds, setSelectedRecommenderIds] = useState<
    string[]
  >([]);
  const [isRecommenderSelectOpen, setIsRecommenderSelectOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("請輸入電影名稱");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          image: image.trim() || null,
          recommenderIds: selectedRecommenderIds,
        }),
      });

      if (response.ok) {
        setTitle("");
        setImage("");
        setSelectedRecommenderIds([]);
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || "創建電影失敗");
      }
    } catch (error) {
      console.error("Error creating movie:", error);
      alert("創建電影失敗");
    } finally {
      setLoading(false);
    }
  };

  const toggleRecommender = (userId: string) => {
    setSelectedRecommenderIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-lg p-6 mb-6 border border-gray-800"
    >
      <h3 className="text-xl font-semibold mb-4">新增電影</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">電影名稱 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white"
            placeholder="輸入電影名稱"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            電影海報 URL（可選）
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* 推薦人選擇 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            大推人（可選）
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsRecommenderSelectOpen(!isRecommenderSelectOpen)
              }
              className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white text-left flex items-center justify-between"
            >
              <span className="truncate">
                {selectedRecommenderIds.length > 0
                  ? `已選擇 ${selectedRecommenderIds.length} 位大推人`
                  : "選擇大推人"}
              </span>
              <span className="text-xs text-gray-400">▼</span>
            </button>

            {isRecommenderSelectOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-surface border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => toggleRecommender(user.id)}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        selectedRecommenderIds.includes(user.id)
                          ? "bg-blue-600/20 border border-blue-600"
                          : "hover:bg-gray-700 border border-transparent"
                      }`}
                    >
                      <div className="w-6 h-6 flex-shrink-0">
                        {isImageUrl(user.icon) ? (
                          <div className="w-full h-full rounded-full overflow-hidden">
                            <img
                              src={user.icon}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="text-lg leading-none text-center">
                            {user.icon}
                          </div>
                        )}
                      </div>
                      <span className="text-sm truncate">{user.name}</span>
                      {selectedRecommenderIds.includes(user.id) && (
                        <span className="ml-auto text-blue-500 text-xs">✓</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 已選推薦人預覽 */}
          {selectedRecommenderIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedRecommenderIds.map((id) => {
                const user = users.find((u) => u.id === id);
                if (!user) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center gap-1 bg-gray-800 rounded-full px-2 py-1 text-xs border border-gray-700"
                  >
                    {isImageUrl(user.icon) ? (
                      <div className="w-4 h-4 rounded-full overflow-hidden">
                        <img
                          src={user.icon}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span>{user.icon}</span>
                    )}
                    <span>{user.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleRecommender(id)}
                      className="ml-1 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "創建中..." : "創建電影"}
        </button>
      </div>
    </form>
  );
}
