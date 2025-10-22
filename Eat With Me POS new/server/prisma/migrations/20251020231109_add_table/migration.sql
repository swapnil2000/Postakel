/*
  Warnings:

  - A unique constraint covering the columns `[tableNumber]` on the table `Table` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Table" ADD COLUMN     "customer" TEXT,
ADD COLUMN     "guests" INTEGER DEFAULT 0,
ADD COLUMN     "orderAmount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "timeOccupied" TEXT,
ADD COLUMN     "waiter" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Table_tableNumber_key" ON "Table"("tableNumber");
