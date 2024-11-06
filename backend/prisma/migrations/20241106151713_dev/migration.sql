/*
  Warnings:

  - You are about to drop the column `questionCount` on the `Round` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Round" DROP COLUMN "questionCount",
ADD COLUMN     "easyQ" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hardQ" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mediumQ" INTEGER NOT NULL DEFAULT 0;
