"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RatingForm from "./RatingForm";

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
}

interface MovieCardProps {
  movie: Movie;
  onUpdate: () => void;
  viewMode?: "small" | "large";
}

export default function MovieCard({
  movie,
  onUpdate,
  viewMode = "large",
}: MovieCardProps) {
  const router = useRouter();
  const [showRatingModal, setShowRatingModal] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // 如果點擊的是按鈕或表單，不跳轉
    const target = e.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.closest("button") ||
      target.closest("form") ||
      target.closest('[role="dialog"]')
    ) {
      return;
    }
    router.push(`/movies/${movie.id}`);
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // 判斷是否是爛片（平均分低於 3 分）
  const isBadMovie = movie.averageRating > 0 && movie.averageRating < 3;

  // 渲染最近評分的用戶圖標（最多顯示 3 個）
  const renderRecentRaters = () => {
    const recentRatings = movie.ratings.slice(0, 3);
    if (recentRatings.length === 0) return null;

    return (
      <div className="flex -space-x-2 mr-2">
        {recentRatings.map((rating, index) => (
          <div
            key={rating.id}
            className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-surface z-10"
            style={{ zIndex: 10 - index }}
            title={rating.user.name}
          >
            {isImageUrl(rating.user.icon) ? (
              <img
                src={rating.user.icon}
                alt={rating.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs">
                {rating.user.icon}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (viewMode === "small") {
    return (
      <>
        <div
          className="bg-surface rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          onClick={handleCardClick}
        >
          <div className="flex gap-4">
            {movie.image && (
              <div className="flex-shrink-0 w-20 relative">
                <div className="aspect-[2/3] overflow-hidden rounded">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isBadMovie && (
                  <div className="absolute -top-1.5 -left-1.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm opacity-95 z-10 border border-white/30 shadow-sm rotate-[-12deg]">
                    伏到PK
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h3
                  className="text-lg font-bold flex-1 overflow-hidden hover:text-blue-400 transition-colors"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                  title={movie.title}
                >
                  {movie.title}
                </h3>
              </div>
              <div className="mb-3">
                <div className="text-sm mb-1">
                  平均:{" "}
                  {movie.averageRating > 0
                    ? movie.averageRating.toFixed(1)
                    : "無"}
                  /5.0
                </div>
                <div className="flex items-center">
                  {renderRecentRaters()}
                  <div className="text-xs text-gray-400">
                    {movie.ratingCount} 個評分
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRatingModal(true);
                }}
                className="w-full px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-xs"
              >
                評分
              </button>
            </div>
          </div>
        </div>

        {/* 評分彈出對話框 - 小圖模式 */}
        {showRatingModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowRatingModal(false);
              }
            }}
          >
            <div className="bg-surface rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">為「{movie.title}」評分</h3>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="text-gray-400 hover:text-white text-2xl leading-none"
                  aria-label="關閉"
                >
                  ×
                </button>
              </div>
              <RatingForm
                movieId={movie.id}
                onSuccess={() => {
                  setShowRatingModal(false);
                  onUpdate();
                }}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-surface rounded-lg p-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        {movie.image && (
          <div
            className="flex-shrink-0 w-full md:w-48 cursor-pointer relative"
            onClick={handleCardClick}
          >
            <div className="aspect-[2/3] overflow-hidden rounded-lg">
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </div>
            {isBadMovie && (
              <div className="absolute -top-2 -left-2 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-sm opacity-95 z-10 border-2 border-white shadow-md rotate-[-12deg]">
                伏到PK
              </div>
            )}
          </div>
        )}
        <div className="flex-1">
          <h3
            className="text-2xl font-bold mb-2 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={handleCardClick}
          >
            {movie.title}
          </h3>
          <div className="mb-4">
            <div className="text-lg mb-1">
              平均評分:{" "}
              {movie.averageRating > 0 ? movie.averageRating.toFixed(1) : "無"}{" "}
              / 5.0
            </div>
            <div className="flex items-center">
              {renderRecentRaters()}
              <div className="text-sm text-gray-400">
                {movie.ratingCount} 個評分
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowRatingModal(true);
            }}
            className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
          >
            新增評分
          </button>

          {movie.ratings.length > 0 && (
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-lg">評分記錄</h4>
              {movie.ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="bg-background rounded-lg p-4 border border-gray-800"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isImageUrl(rating.user.icon) ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={rating.user.icon}
                          alt={rating.user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-2xl">{rating.user.icon}</span>
                    )}
                    <span className="font-medium">{rating.user.name}</span>
                    <span className="text-yellow-400 ml-auto">
                      {renderStars(rating.rating)}
                    </span>
                  </div>
                  {rating.review && (
                    <p className="text-gray-300 text-sm mt-2">
                      {rating.review}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(rating.createdAt).toLocaleString("zh-TW")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 評分彈出對話框 */}
      {showRatingModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRatingModal(false);
            }
          }}
        >
          <div className="bg-surface rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">為「{movie.title}」評分</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
                aria-label="關閉"
              >
                ×
              </button>
            </div>
            <RatingForm
              movieId={movie.id}
              onSuccess={() => {
                setShowRatingModal(false);
                onUpdate();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
