import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        ratings: {
          include: {
            user: true,
          },
        },
        recommenders: true, // 包含推薦人信息
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
        recommenders: movie.recommenders
          ? movie.recommenders.map((r: any) => ({
              id: r.id,
              name: r.name,
              icon: r.icon,
            }))
          : [],
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
    // 使用統一的錯誤處理，確保記錄到日誌
    // handleApiError 會自動記錄 500 錯誤（在 Vercel 中輸出到控制台，本地寫入文件）
    handleApiError(error, {
      status: 500,
      message: "Failed to fetch movies",
      route: "/api/movies",
      method: "GET",
    });

    // GET 請求在錯誤時返回空數組而不是錯誤對象（為了前端兼容性）
    // 錯誤已經被記錄（Vercel 控制台或本地日誌文件）
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  let title: string | undefined;
  try {
    const body = await request.json();
    title = body.title;
    const { image, recommenderIds } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        image: image || null,
        recommenders:
          recommenderIds && recommenderIds.length > 0
            ? {
                connect: recommenderIds.map((id: string) => ({ id })),
              }
            : undefined,
      },
      include: {
        recommenders: true,
      },
    });

    logger.info("Movie created successfully", {
      movieId: movie.id,
      title: movie.title,
      recommendersCount: movie.recommenders.length,
    });
    return NextResponse.json(movie, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      logger.warn("Movie already exists", { title: title || "unknown" });
      return NextResponse.json(
        { error: "Movie already exists" },
        { status: 409 }
      );
    }
    return handleApiError(error, {
      status: 500,
      message: "Failed to create movie",
      route: "/api/movies",
      method: "POST",
    });
  }
}
