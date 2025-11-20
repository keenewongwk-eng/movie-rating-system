import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { handleApiError } from "@/lib/api-error-handler";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { rating, review } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const updatedRating = await prisma.rating.update({
      where: { id: params.id },
      data: {
        rating,
        review: review !== undefined ? review : null,
      },
      include: {
        movie: true,
        user: true,
      },
    });

    logger.info("Rating updated successfully", { ratingId: params.id });
    return NextResponse.json(updatedRating);
  } catch (error: any) {
    if (error.code === "P2025") {
      logger.warn("Rating not found", { ratingId: params.id });
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }
    return handleApiError(error, {
      status: 500,
      message: "Failed to update rating",
      route: `/api/ratings/${params.id}`,
      method: "PUT",
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.rating.delete({
      where: { id: params.id },
    });

    logger.info("Rating deleted successfully", { ratingId: params.id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") {
      logger.warn("Rating not found for deletion", { ratingId: params.id });
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }
    return handleApiError(error, {
      status: 500,
      message: "Failed to delete rating",
      route: `/api/ratings/${params.id}`,
      method: "DELETE",
    });
  }
}
