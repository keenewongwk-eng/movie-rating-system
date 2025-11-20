import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        ratings: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 計算每部電影的平均評分
    const moviesWithStats = movies.map((movie: any) => {
      const ratings = movie.ratings || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) /
            ratings.length
          : 0;

      return {
        id: movie.id,
        title: movie.title,
        image: movie.image,
        createdAt: movie.createdAt.toISOString(),
        updatedAt: movie.updatedAt.toISOString(),
        averageRating: Math.round(avgRating * 10) / 10,
        ratingCount: ratings.length,
        ratings: ratings.map((r: any) => ({
          id: r.id,
          rating: r.rating,
          review: r.review,
          createdAt: r.createdAt.toISOString(),
          user: {
            id: r.user.id,
            name: r.user.name,
            icon: r.user.icon,
          },
        })),
      };
    });

    // 確保返回數組
    logger.info("Movies fetched successfully", {
      count: moviesWithStats.length,
    });
    return NextResponse.json(
      Array.isArray(moviesWithStats) ? moviesWithStats : []
    );
  } catch (error: any) {
    logger.error("Error fetching movies", error);
    
    // 在生產環境中提供更詳細的錯誤信息
    const errorMessage = error?.message || "Unknown error";
    const errorCode = error?.code || "UNKNOWN";
    
    console.error("Movies API Error:", {
      message: errorMessage,
      code: errorCode,
      stack: error?.stack,
    });
    
    // 返回錯誤信息以便調試（開發環境）或空數組（生產環境）
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        { 
          error: "Failed to fetch movies", 
          details: errorMessage,
          code: errorCode 
        },
        { status: 500 }
      );
    }
    
    // 生產環境返回空數組，但記錄詳細錯誤
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  let title: string | undefined;
  try {
    const body = await request.json();
    title = body.title;
    const { image } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        image: image || null,
      },
    });

    logger.info("Movie created successfully", {
      movieId: movie.id,
      title: movie.title,
    });
    return NextResponse.json(movie, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating movie", error);
    if (error.code === "P2002") {
      logger.warn("Movie already exists", { title: title || "unknown" });
      return NextResponse.json(
        { error: "Movie already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create movie" },
      { status: 500 }
    );
  }
}
