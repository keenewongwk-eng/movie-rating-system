import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/api-error-handler";
import { createNotification } from "@/lib/notifications";

export async function GET() {
  try {
    const ratings = await prisma.rating.findMany({
      include: {
        movie: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.info("Ratings fetched successfully", { count: ratings.length });
    return NextResponse.json(ratings);
  } catch (error: any) {
    return handleApiError(error, {
      status: 500,
      message: "Failed to fetch ratings",
      route: "/api/ratings",
      method: "GET",
    });
  }
}

export async function POST(request: Request) {
  let movieId: string | undefined;
  let userId: string | undefined;

  try {
    const body = await request.json();
    movieId = body.movieId;
    userId = body.userId;
    const { rating, review, parentId } = body;

    if (!movieId || !userId) {
      return NextResponse.json(
        { error: "movieId and userId are required" },
        { status: 400 }
      );
    }

    // 如果是主評論（沒有 parentId），rating 必須存在
    if (!parentId && !rating) {
      return NextResponse.json(
        { error: "Rating is required for main comments" },
        { status: 400 }
      );
    }

    // 如果提供了 rating，驗證範圍
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // 如果是主評論，檢查用戶是否已經評分過這部電影
    if (!parentId) {
      const existingRating = await prisma.rating.findFirst({
        where: {
          movieId,
          userId,
          parentId: null,
        },
      });

      if (existingRating) {
        logger.warn("User already rated this movie", { movieId, userId });
        return NextResponse.json(
          { error: "You have already rated this movie" },
          { status: 409 }
        );
      }
    }

    const newRating = await prisma.rating.create({
      data: {
        movieId,
        userId,
        rating: rating || null,
        review: review || null,
        parentId: parentId || null,
      },
      include: {
        movie: true,
        user: true,
      },
    });

    logger.info("Rating/Reply created successfully", {
      ratingId: newRating.id,
      movieId,
      userId,
      isReply: !!parentId,
    });

    // 創建通知
    if (parentId) {
      // 回覆通知
      await createNotification({
        type: "reply_create",
        message: `${newRating.user.name} 回覆了「${newRating.movie.title}」的評論`,
        entityId: newRating.id,
        entityType: "rating",
        metadata: {
          userName: newRating.user.name,
          movieTitle: newRating.movie.title,
          review: newRating.review,
        },
      });
    } else {
      // 評分通知
      await createNotification({
        type: "rating_create",
        message: `${newRating.user.name} 為「${newRating.movie.title}」評分 ${newRating.rating} 星`,
        entityId: newRating.id,
        entityType: "rating",
        metadata: {
          userName: newRating.user.name,
          movieTitle: newRating.movie.title,
          rating: newRating.rating,
          review: newRating.review,
        },
      });
    }

    return NextResponse.json(newRating, { status: 201 });
  } catch (error: any) {
    return handleApiError(error, {
      status: 500,
      message: "Failed to create rating",
      route: "/api/ratings",
      method: "POST",
    });
  }
}
