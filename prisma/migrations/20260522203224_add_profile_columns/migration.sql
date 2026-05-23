/*
  Warnings:

  - Made the column `subject` on table `MessageThread` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MessageThread" ALTER COLUMN "subject" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "profileColumn1" TEXT,
ADD COLUMN     "profileColumn2" TEXT;
