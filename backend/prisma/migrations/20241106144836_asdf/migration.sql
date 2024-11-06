/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `Round` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `Round` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Round" ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Round_order_key" ON "Round"("order");
