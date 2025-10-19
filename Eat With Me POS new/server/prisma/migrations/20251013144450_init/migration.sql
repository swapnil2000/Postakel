/*
  Warnings:

  - A unique constraint covering the columns `[vendorId]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "vendorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_vendorId_key" ON "Restaurant"("vendorId");
