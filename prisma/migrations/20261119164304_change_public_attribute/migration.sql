/*
  Warnings:

  - The `isPublic` column on the `Story` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Story" DROP COLUMN "isPublic",
ADD COLUMN     "isPublic" TEXT[] DEFAULT ARRAY[]::TEXT[];
