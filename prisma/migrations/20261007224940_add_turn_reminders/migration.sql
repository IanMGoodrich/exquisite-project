-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "remindersSent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "turnStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "emailReminders" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Story_completed_turnStartedAt_idx" ON "Story"("completed", "turnStartedAt");
