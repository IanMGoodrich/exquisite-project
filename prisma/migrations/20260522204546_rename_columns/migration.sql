/*
  Warnings:

  - You are about to drop the column `profileColumn1` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `profileColumn2` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "profileColumn1",
DROP COLUMN "profileColumn2",
ADD COLUMN     "profileColumnOne" TEXT,
ADD COLUMN     "profileColumnTwo" TEXT;
