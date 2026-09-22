/*
  Warnings:

  - Made the column `userName` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "userName" SET NOT NULL;
