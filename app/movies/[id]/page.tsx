"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import RatingForm from "@/components/RatingForm";

// 判斷是否為圖片 URL（base64 或 http/https）
const isImageUrl = (icon: string): boolean => {
  return (
    icon.startsWith("data:image/") ||
    icon.startsWith("http://") ||
    icon.startsWith("https://")
  );
};

interface Movie {
  id: string;
  title: string;
  image: string | null;
  averageRating: number;
  ratingCount: number;
  createdAt: string;
  ratings: Array<{
    id: string;
    rating: number;
    review: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string;
      icon: string;
    };
  }>;
  recommenders: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
}

interface User {
  id: string;
  name: string;
  icon: string;
}

export default function MoviePage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 推薦人編輯狀態
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRecommenderIds, setSelectedRecommenderIds] = useState<
    string[]
  >([]);
  const [isRecommenderSelectOpen, setIsRecommenderSelectOpen] = useState(false);

  // 評分編輯狀態
  const [editingRatingId, setEditingRatingId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editReview, setEditReview] = useState<string>("");
  const [showDeleteRatingConfirm, setShowDeleteRatingConfirm] = useState<
    string | null
  >(null);
  const [deletingRatingId, setDeletingRatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchMovie();
    fetchUsers();
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const response = await fetch(`/api/movies/${movieId}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch movie");
      }
      const data = await response.json();
      setMovie(data);
      setEditTitle(data.title);
      setEditImage(data.image || "");
      setSelectedRecommenderIds(
        data.recommenders ? data.recommenders.map((r: any) => r.id) : []
      );
    } catch (error) {
      console.error("Error fetching movie:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const toggleRecommender = (userId: string) => {
    setSelectedRecommenderIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      alert("請輸入電影名稱");
      return;
    }

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
          image: editImage.trim() || null,
          recommenderIds: selectedRecommenderIds,
        }),
      });

      if (response.ok) {
        const updatedMovie = await response.json();
        setMovie(updatedMovie);
        setEditing(false);
      } else {
        const error = await response.json();
        alert(error.error || "更新失敗");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      alert("更新失敗");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
      } else {
        const error = await response.json();
        alert(error.error || "刪除失敗");
        setDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("刪除失敗");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditRating = (rating: Movie["ratings"][0]) => {
    setEditingRatingId(rating.id);
    setEditRating(rating.rating);
    setEditReview(rating.review || "");
  };

  const handleCancelEditRating = () => {
    setEditingRatingId(null);
    setEditRating(5);
    setEditReview("");
  };

  const handleUpdateRating = async (ratingId: string) => {
    if (editRating < 1 || editRating > 5) {
      alert("評分必須在 1-5 之間");
      return;
    }

    try {
      const response = await fetch(`/api/ratings/${ratingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: editRating,
          review: editReview.trim() || null,
        }),
      });

      if (response.ok) {
        await fetchMovie();
        setEditingRatingId(null);
        setEditRating(5);
        setEditReview("");
      } else {
        const error = await response.json();
        alert(error.error || "更新失敗");
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      alert("更新失敗");
    }
  };

  const handleDeleteRating = async (ratingId: string) => {
    setDeletingRatingId(ratingId);
    try {
      const response = await fetch(`/api/ratings/${ratingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchMovie();
        setShowDeleteRatingConfirm(null);
      } else {
        const error = await response.json();
        alert(error.error || "刪除失敗");
      }
    } catch (error) {
      console.error("Error deleting rating:", error);
      alert("刪除失敗");
    } finally {
      setDeletingRatingId(null);
    }
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

  if (!movie) {
    return (
      <main className="min-h-screen bg-background text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">找不到這部電影</p>
            <Link href="/" className="text-blue-400 hover:underline">
              返回首頁
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 返回按鈕 */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6"
        >
          ← 返回電影列表
        </Link>

        {/* 電影標題和圖片 */}
        <div className="mb-6">
          {editing ? (
            <div className="space-y-4 bg-surface p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">編輯電影</h3>
              <div>
                <label className="block text-sm font-medium mb-1">
                  電影名稱
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="電影名稱"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  圖片 URL
                </label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="圖片 URL（可選）"
                />
              </div>

              {/* 推薦人選擇 */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  推薦人（可選）
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsRecommenderSelectOpen(!isRecommenderSelectOpen)
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-left flex items-center justify-between"
                  >
                    <span className="truncate">
                      {selectedRecommenderIds.length > 0
                        ? `已選擇 ${selectedRecommenderIds.length} 位推薦人`
                        : "選擇推薦人"}
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
                            <span className="text-sm truncate">
                              {user.name}
                            </span>
                            {selectedRecommenderIds.includes(user.id) && (
                              <span className="ml-auto text-blue-500 text-xs">
                                ✓
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  保存更改
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditTitle(movie.title);
                    setEditImage(movie.image || "");
                    setSelectedRecommenderIds(
                      movie.recommenders.map((r) => r.id)
                    );
                  }}
                  className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {movie.image && (
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full sm:w-32 md:w-40 h-auto sm:h-48 md:h-56 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 w-full">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 break-words">
                  {movie.title}
                </h1>

                {/* 顯示推薦人 */}
                {movie.recommenders && movie.recommenders.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <span className="text-yellow-500 text-lg">👍</span>
                    <span className="text-gray-300">
                      由{" "}
                      <span className="font-semibold text-white">
                        {movie.recommenders.map((r) => r.name).join(", ")}
                      </span>{" "}
                      推薦
                    </span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-yellow-400 text-lg sm:text-xl">
                      ★
                    </span>
                    <span className="text-lg sm:text-xl font-semibold">
                      {movie.averageRating > 0
                        ? movie.averageRating.toFixed(1)
                        : "無"}
                    </span>
                    <span className="text-gray-400 text-sm sm:text-base">
                      ({movie.ratingCount} 個評分)
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setEditing(true)}
                    className="px-3 py-1.5 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    編輯電影
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-1.5 text-sm sm:text-base bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    刪除電影
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 刪除電影確認對話框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                確認刪除
              </h2>
              <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 break-words">
                確定要刪除「{movie.title}
                」嗎？此操作無法復原，所有相關評分也會被刪除。
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-3 py-2 text-sm sm:text-base bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {deleting ? "刪除中..." : "確認刪除"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleting(false);
                  }}
                  disabled={deleting}
                  className="flex-1 px-3 py-2 text-sm sm:text-base bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 刪除評分確認對話框 */}
        {showDeleteRatingConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                確認刪除評分
              </h2>
              <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
                確定要刪除這個評分嗎？此操作無法復原。
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleDeleteRating(showDeleteRatingConfirm)}
                  disabled={deletingRatingId === showDeleteRatingConfirm}
                  className="flex-1 px-3 py-2 text-sm sm:text-base bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 transition-colors"
                >
                  {deletingRatingId === showDeleteRatingConfirm
                    ? "刪除中..."
                    : "確認刪除"}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteRatingConfirm(null);
                    setDeletingRatingId(null);
                  }}
                  disabled={deletingRatingId === showDeleteRatingConfirm}
                  className="flex-1 px-3 py-2 text-sm sm:text-base bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 評分表單 */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">新增評分</h2>
          <RatingForm movieId={movieId} onSuccess={fetchMovie} />
        </div>

        {/* 評論列表 */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            所有評論 ({movie.ratings.length})
          </h2>
          {movie.ratings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              還沒有評論，快來第一個評分吧！
            </div>
          ) : (
            <div className="space-y-4">
              {movie.ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-700"
                >
                  {editingRatingId === rating.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          評分
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditRating(star)}
                              className={`text-xl ${
                                star <= editRating
                                  ? "text-yellow-400"
                                  : "text-gray-600"
                              } transition-colors`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {editRating} / 5 星
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          評語（可選）
                        </label>
                        <textarea
                          value={editReview}
                          onChange={(e) => setEditReview(e.target.value)}
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm resize-none"
                          rows={3}
                          placeholder="寫下你的想法..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateRating(rating.id)}
                          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                        >
                          保存
                        </button>
                        <button
                          onClick={handleCancelEditRating}
                          className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                        {isImageUrl(rating.user.icon) ? (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={rating.user.icon}
                              alt={rating.user.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-xl sm:text-2xl">
                            {rating.user.icon}
                          </span>
                        )}
                        <span className="font-semibold text-sm sm:text-base">
                          {rating.user.name}
                        </span>
                        <span className="text-yellow-400 text-sm sm:text-base">
                          {"★".repeat(rating.rating) +
                            "☆".repeat(5 - rating.rating)}
                        </span>
                        <span className="text-gray-400 text-xs sm:text-sm">
                          {new Date(rating.createdAt).toLocaleDateString(
                            "zh-TW"
                          )}
                        </span>
                      </div>
                      <div className="relative min-h-[2rem]">
                        {rating.review && (
                          <p className="text-gray-300 mt-2 text-sm sm:text-base whitespace-pre-wrap break-words pr-20">
                            {rating.review}
                          </p>
                        )}
                        {/* 按鈕固定在右下角 */}
                        <div className="absolute bottom-0 right-0 flex gap-1">
                          <button
                            onClick={() => handleEditRating(rating)}
                            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                            title="編輯"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() =>
                              setShowDeleteRatingConfirm(rating.id)
                            }
                            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                            title="刪除"
                          >
                            刪除
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
