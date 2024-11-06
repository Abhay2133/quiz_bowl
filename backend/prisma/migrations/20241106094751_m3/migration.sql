/*
  Warnings:

  - Added the required column `testcode` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "testcode" TEXT NOT NULL;
