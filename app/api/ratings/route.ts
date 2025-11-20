import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
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

    return NextResponse.json(newRating, { status: 201 });
  } catch (error: any) {
    console.error("Error creating rating:", error);
    if (error.code === "P2002") {
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
