// app/api/[userId]/segments/[segmentId]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string; segmentId: string }> }
) {
  try {
    const params = await context.params;
    const { userId, segmentId } = params;
    
    // Rate limiting
    const recentLike = await prisma.segmentLike.findFirst({
      where: {
        segmentId,
        userId,
        createdAt: { gt: new Date(Date.now() - 1000) } // Last 1 second
      }
    });

    if (recentLike) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Check if like exists
    const existingLike = await prisma.segmentLike.findUnique({
      where: { segmentId_userId: { segmentId, userId } }
    });

    let liked: boolean;

    if (existingLike) {
      // Unlike
      await prisma.segmentLike.delete({
        where: { segmentId_userId: { segmentId, userId } }
      });
      liked = false;
    } else {
      // Like
      await prisma.segmentLike.create({
        data: {
          segmentId,
          userId
        }
      });
      liked = true;
    }

    return NextResponse.json({ liked }, { status: 200 });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json(
      { error: 'Failed to update like' },
      { status: 500 }
    );
  }
}