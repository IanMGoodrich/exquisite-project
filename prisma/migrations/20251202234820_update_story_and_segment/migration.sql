-- AlterTable
ALTER TABLE "Segment" ADD COLUMN     "reveal" TEXT;

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "completedRounds" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rounds" INTEGER NOT NULL DEFAULT 3;
