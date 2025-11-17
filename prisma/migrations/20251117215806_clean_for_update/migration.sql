/*
  Warnings:

  - You are about to drop the `Segment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SegmentLike` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Story` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_StoryToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Segment" DROP CONSTRAINT "Segment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Segment" DROP CONSTRAINT "Segment_storyId_fkey";

-- DropForeignKey
ALTER TABLE "SegmentLike" DROP CONSTRAINT "SegmentLike_segmentId_fkey";

-- DropForeignKey
ALTER TABLE "SegmentLike" DROP CONSTRAINT "SegmentLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "_StoryToUser" DROP CONSTRAINT "_StoryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_StoryToUser" DROP CONSTRAINT "_StoryToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropTable
DROP TABLE "Segment";

-- DropTable
DROP TABLE "SegmentLike";

-- DropTable
DROP TABLE "Story";

-- DropTable
DROP TABLE "_StoryToUser";

-- DropTable
DROP TABLE "account";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "verification";
