/*
  Warnings:

  - You are about to drop the column `teamId` on the `LiveAnswer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LiveAnswer" DROP CONSTRAINT "LiveAnswer_teamId_fkey";

-- AlterTable
ALTER TABLE "LiveAnswer" DROP COLUMN "teamId";
