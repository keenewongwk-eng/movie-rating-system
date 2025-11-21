import MovieList from "@/components/MovieList";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold">🎬 小西北影評</h1>
            <Link
              href="/notifications"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
              title="查看活動通知"
            >
              <span className="text-2xl">📢</span>
              <span className="hidden sm:inline">通知</span>
            </Link>
          </div>
          <p className="text-gray-400">和你的朋友一起評分電影！</p>
        </header>
        <MovieList />
      </div>
    </main>
  );
}
