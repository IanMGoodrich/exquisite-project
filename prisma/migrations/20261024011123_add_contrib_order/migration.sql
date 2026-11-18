-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "contributorOrder" TEXT[] DEFAULT ARRAY[]::TEXT[];
