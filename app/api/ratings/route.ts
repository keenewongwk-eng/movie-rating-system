import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

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
  } catch (error) {
    logger.error("Error fetching ratings", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { movieId, userId, rating, review } = body;

    if (!movieId || !userId || !rating) {
      return NextResponse.json(
        { error: "movieId, userId, and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const newRating = await prisma.rating.create({
      data: {
        movieId,
        userId,
        rating,
        review: review || null,
      },
      include: {
        movie: true,
        user: true,
      },
    });

    logger.info("Rating created successfully", { ratingId: newRating.id, movieId, userId });
    return NextResponse.json(newRating, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating rating", error);
    if (error.code === "P2002") {
      logger.warn("User already rated this movie", { movieId, userId });
      return NextResponse.json(
        { error: "You have already rated this movie" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create rating" },
      { status: 500 }
    );
  }
}
