/*
  Warnings:

  - You are about to drop the column `order` on the `Round` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Test` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[testcode]` on the table `Test` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Round" DROP COLUMN "order";

-- CreateIndex
CREATE UNIQUE INDEX "Test_name_key" ON "Test"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Test_testcode_key" ON "Test"("testcode");
