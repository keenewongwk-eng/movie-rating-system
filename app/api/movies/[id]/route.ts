import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: params.id },
      include: {
        ratings: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        recommenders: true, // 包含推薦人
      },
    });

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    // 計算平均評分
    const ratings = movie.ratings || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) /
          ratings.length
        : 0;

    return NextResponse.json({
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
    });
  } catch (error: any) {
    return handleApiError(error, {
      status: 500,
      message: "Failed to fetch movie",
      route: `/api/movies/${params.id}`,
      method: "GET",
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, image, recommenderIds } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: params.id },
      data: {
        title,
        image: image !== undefined ? image : undefined,
        recommenders: recommenderIds
          ? {
              set: recommenderIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        ratings: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        recommenders: true,
      },
    });

    // 計算平均評分
    const ratings = updatedMovie.ratings || [];
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) /
          ratings.length
        : 0;

    return NextResponse.json({
      id: updatedMovie.id,
      title: updatedMovie.title,
      image: updatedMovie.image,
      createdAt: updatedMovie.createdAt.toISOString(),
      updatedAt: updatedMovie.updatedAt.toISOString(),
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
      recommenders: updatedMovie.recommenders
        ? updatedMovie.recommenders.map((r: any) => ({
            id: r.id,
            name: r.name,
            icon: r.icon,
          }))
        : [],
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Movie title already exists" },
        { status: 409 }
      );
    }
    return handleApiError(error, {
      status: 500,
      message: "Failed to update movie",
      route: `/api/movies/${params.id}`,
      method: "PUT",
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.movie.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }
    return handleApiError(error, {
      status: 500,
      message: "Failed to delete movie",
      route: `/api/movies/${params.id}`,
      method: "DELETE",
    });
  }
}
