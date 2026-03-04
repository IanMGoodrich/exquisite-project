/*
  Warnings:

  - Added the required column `email` to the `SegmentLike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `SegmentLike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SegmentLike" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;
