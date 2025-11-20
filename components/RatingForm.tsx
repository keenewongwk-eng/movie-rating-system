"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// 判斷是否為圖片 URL（base64 或 http/https）
const isImageUrl = (icon: string): boolean => {
  return (
    icon.startsWith("data:image/") ||
    icon.startsWith("http://") ||
    icon.startsWith("https://")
  );
};

interface User {
  id: string;
  name: string;
  icon: string;
}

interface RatingFormProps {
  movieId: string;
  onSuccess: () => void;
}

export default function RatingForm({ movieId, onSuccess }: RatingFormProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUserName, setNewUserName] = useState<string>("");
  const [newUserIcon, setNewUserIcon] = useState<string>("😊");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
      if (data.length > 0 && !selectedUserId) {
        setSelectedUserId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert("請選擇用戶");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          userId: selectedUserId,
          rating,
          review: review.trim() || null,
        }),
      });

      if (response.ok) {
        setReview("");
        setRating(5);
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || "評分失敗");
      }
    } catch (error) {
      console.error("Error creating rating:", error);
      alert("評分失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) {
      alert("請輸入用戶名稱");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUserName.trim(),
          icon: newUserIcon,
        }),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]);
        setSelectedUserId(newUser.id);
        setNewUserName("");
        setShowUserForm(false);
      } else {
        const error = await response.json();
        alert(error.error || "創建用戶失敗");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      alert("創建用戶失敗");
    }
  };

  const commonIcons = ["😊", "😎", "🐻", "🐨", "🤖", "👻", "🎭", "🦄"];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-background p-4 rounded-lg border border-gray-800"
    >
      <div>
        <label className="block text-sm font-medium mb-2">選擇用戶</label>
        <div className="flex gap-2 mb-2">
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="flex-1 bg-surface border border-gray-700 rounded-lg px-3 py-2 text-white"
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {isImageUrl(user.icon) ? "🖼️" : user.icon} {user.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowUserForm(!showUserForm)}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm"
          >
            {showUserForm ? "取消" : "+ 新用戶"}
          </button>
        </div>

        {showUserForm && (
          <div className="bg-surface p-4 rounded-lg border border-gray-700 mb-2">
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  用戶名稱
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-background border border-gray-700 rounded-lg px-3 py-2 text-white"
                  placeholder="輸入用戶名稱"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  選擇圖示
                </label>
                <div className="flex gap-2 flex-wrap">
                  {commonIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewUserIcon(icon)}
                      className={`text-2xl p-2 rounded-lg border-2 ${
                        newUserIcon === icon
                          ? "border-yellow-400 bg-yellow-400/20"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                創建用戶
              </button>
            </form>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">評分</label>
        <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              className={`text-3xl transition-all transform hover:scale-110 ${
                star <= (hoverRating || rating)
                  ? "text-yellow-400"
                  : "text-gray-600"
              }`}
            >
              {star <= (hoverRating || rating) ? "★" : "☆"}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {hoverRating || rating} / 5 星
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">評語（可選）</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full bg-surface border border-gray-700 rounded-lg px-3 py-2 text-white resize-none"
          rows={3}
          placeholder="寫下你的想法..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "提交中..." : "提交評分"}
      </button>
    </form>
  );
}
