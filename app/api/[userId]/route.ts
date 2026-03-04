import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const { email, userName, firstName, lastName, phoneNumber, image } =
      await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        userName,
        nameFirst: firstName,
        nameLast: lastName,
        phone: phoneNumber,
        image: image,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 },
    );
  }
}

// GET USER BY USERNAME AUTOCOMPLETE
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  // check for query param `q` for autocomplete, if not present return user by id
  const hasQuery = request.nextUrl.searchParams.has("q");
  const { userId } = await params;

  // if query param `q` is present, do autocomplete search for story creation
  if (hasQuery) {
    // get the request url and get the
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") ?? "").trim();

    if (!query) return NextResponse.json([]);

    const users = await prisma.user.findMany({
      where: {
        userName: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        userName: true,
        name: true,
      },
      take: 10,
    });
    return NextResponse.json(users);
  }

  // if no query param `q`, return user by id for segmentLike functionality
  if (!hasQuery) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          userName: true,
          email: true,
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      console.error("Get user error:", error);
      return NextResponse.json(
        { error: "Failed to get user" },
        { status: 500 },
      );
    }
  }
}
