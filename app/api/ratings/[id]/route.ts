import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json(updatedRating);
  } catch (error: any) {
    console.error("Error updating rating:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update rating" },
      { status: 500 }
    );
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting rating:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete rating" },
      { status: 500 }
    );
  }
}
