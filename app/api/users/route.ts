import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    logger.info("Users fetched successfully", { count: users.length });
    return NextResponse.json(users);
  } catch (error) {
    logger.error("Error fetching users", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
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

    logger.info("User created successfully", { userId: user.id, name: user.name });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    logger.error("Error creating user", error);
    if (error.code === "P2002") {
      logger.warn("User already exists", { name });
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
