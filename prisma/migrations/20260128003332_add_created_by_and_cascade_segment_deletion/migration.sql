/*
  Warnings:

  - You are about to drop the `_StoryToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdById` to the `Story` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Segment" DROP CONSTRAINT "Segment_storyId_fkey";

-- DropForeignKey
ALTER TABLE "_StoryToUser" DROP CONSTRAINT "_StoryToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_StoryToUser" DROP CONSTRAINT "_StoryToUser_B_fkey";

-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "createdById" TEXT NOT NULL;

-- DropTable
DROP TABLE "_StoryToUser";

-- CreateTable
CREATE TABLE "_StoryContributors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StoryContributors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StoryContributors_B_index" ON "_StoryContributors"("B");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Segment" ADD CONSTRAINT "Segment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoryContributors" ADD CONSTRAINT "_StoryContributors_A_fkey" FOREIGN KEY ("A") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoryContributors" ADD CONSTRAINT "_StoryContributors_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
