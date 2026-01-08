import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
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
      { status: 500 }
    );
  }
}

// GET USER BY USERNAME AUTOCOMPLETE
export async function GET(
  request: NextRequest
) {
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

