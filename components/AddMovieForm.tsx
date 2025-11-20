"use client";

import { useState } from "react";

interface AddMovieFormProps {
  onSuccess: () => void;
}

export default function AddMovieForm({ onSuccess }: AddMovieFormProps) {
  const [title, setTitle] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
        }),
      });

      if (response.ok) {
        setTitle("");
        setImage("");
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
