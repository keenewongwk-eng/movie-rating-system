import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        recommendedMovies: {
          include: {
            ratings: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const usersWithStats = users.map((user: any) => {
      const badRecommendationsCount = user.recommendedMovies.filter(
        (movie: any) => {
          const ratings = movie.ratings || [];
          const avgRating =
            ratings.length > 0
              ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) /
                ratings.length
              : 0;
          // 平均分大於 0 且小於 3 分視為「伏片」
          return avgRating > 0 && avgRating < 3;
        }
      ).length;

      // 為了保持響應輕量，移除詳細的 recommendedMovies 數據
      // 但如果前端需要顯示具體推薦了哪些電影，可以保留
      // 這裡為了排行榜，只返回數量
      const { recommendedMovies, ...userData } = user;
      return {
        ...userData,
        badRecommendationsCount,
      };
    });

    logger.info("Users fetched successfully", { count: usersWithStats.length });
    return NextResponse.json(usersWithStats);
  } catch (error: any) {
    return handleApiError(error, {
      status: 500,
      message: "Failed to fetch users",
      route: "/api/users",
      method: "GET",
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon } = body;

    if (!name || !icon) {
      return NextResponse.json(
        { error: "Name and icon are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        icon,
      },
    });

    logger.info("User created successfully", {
      userId: user.id,
      name: user.name,
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      logger.warn("User already exists", { name });
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }
    return handleApiError(error, {
      status: 500,
      message: "Failed to create user",
      route: "/api/users",
      method: "POST",
    });
  }
}
