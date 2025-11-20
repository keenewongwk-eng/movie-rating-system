import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api-error-handler";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        ratings: {
          include: {
            movie: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      icon: user.icon,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      ratingCount: user.ratings.length,
      ratings: user.ratings.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        review: r.review,
        createdAt: r.createdAt.toISOString(),
        movie: {
          id: r.movie.id,
          title: r.movie.title,
        },
      })),
    });
  } catch (error: any) {
    return handleApiError(error, {
      status: 500,
      message: "Failed to fetch user",
      route: `/api/users/${params.id}`,
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
    const { name, icon } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        icon: icon !== undefined ? icon : undefined,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "User name already exists" },
        { status: 409 }
      );
    }
    return handleApiError(error, {
      status: 500,
      message: "Failed to update user",
      route: `/api/users/${params.id}`,
      method: "PUT",
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return handleApiError(error, {
      status: 500,
      message: "Failed to delete user",
      route: `/api/users/${params.id}`,
      method: "DELETE",
    });
  }
}

