"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import AddMovieForm from "./AddMovieForm";

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
}

type SortBy = "rating" | "date";
type SortOrder = "asc" | "desc";
type ViewMode = "small" | "large";

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<ViewMode>("large");

  const fetchMovies = async () => {
    try {
      const response = await fetch("/api/movies");
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const sortedMovies = [...movies].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "rating") {
      comparison = a.averageRating - b.averageRating;
    } else if (sortBy === "date") {
      comparison =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSortChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      // 如果點擊相同的排序選項，切換排序順序
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 如果點擊不同的排序選項，設置新的排序方式並重置為降序
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-400">載入中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">電影列表</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 bg-surface rounded-lg p-1">
            <button
              onClick={() => handleSortChange("rating")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                sortBy === "rating"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              評分
              {sortBy === "rating" && (
                <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
            <button
              onClick={() => handleSortChange("date")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                sortBy === "date"
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              日期
              {sortBy === "date" && (
                <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
            <button
              onClick={() => setViewMode("small")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewMode === "small"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              title="小圖模式"
            >
              📱
            </button>
            <button
              onClick={() => setViewMode("large")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewMode === "large"
                  ? "bg-purple-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              title="大圖模式"
            >
              🖼️
            </button>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm whitespace-nowrap"
          >
            {showAddForm ? "取消" : "+ 新增電影"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <AddMovieForm
          onSuccess={() => {
            setShowAddForm(false);
            fetchMovies();
          }}
        />
      )}

      {sortedMovies.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          還沒有電影，快來新增第一部吧！
        </div>
      ) : (
        <div
          className={
            viewMode === "small"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-6"
          }
        >
          {sortedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onUpdate={fetchMovies}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
