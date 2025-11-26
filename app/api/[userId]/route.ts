import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; }> }
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
