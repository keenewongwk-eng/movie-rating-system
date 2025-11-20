import MovieList from "@/components/MovieList";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎬 小西北影評</h1>
          <p className="text-gray-400">和你的朋友一起評分電影！</p>
        </header>
        <MovieList />
      </div>
    </main>
  );
}
