import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, name, userName, firstName, lastName, phoneNumber } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Give DB time to create user record
    await new Promise(resolve => setTimeout(resolve, 500));


    const updatedUser = await prisma.user.update({
      where: { email, name },
      data: {
        userName: userName ? userName : `${firstName}${lastName[0]}`,
        nameFirst: firstName,
        nameLast: lastName,
        phone: phoneNumber ? parseInt(phoneNumber, 10) : null,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}