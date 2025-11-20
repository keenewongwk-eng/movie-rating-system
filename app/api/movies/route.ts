import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const moviesWithStats = movies.map((movie) => {
      const ratings = movie.ratings || [];
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

      return {
        id: movie.id,
        title: movie.title,
        image: movie.image,
        createdAt: movie.createdAt.toISOString(),
        updatedAt: movie.updatedAt.toISOString(),
        averageRating: Math.round(avgRating * 10) / 10,
        ratingCount: ratings.length,
        ratings: ratings.map((r) => ({
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
    return NextResponse.json(Array.isArray(moviesWithStats) ? moviesWithStats : []);
  } catch (error) {
    console.error("Error fetching movies:", error);
    // 返回空數組而不是錯誤對象
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, image } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        image: image || null,
      },
    });

    return NextResponse.json(movie, { status: 201 });
  } catch (error: any) {
    console.error("Error creating movie:", error);
    if (error.code === "P2002") {
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
