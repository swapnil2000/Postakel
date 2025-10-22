/*
  Warnings:

  - Made the column `customer` on table `Table` required. This step will fail if there are existing NULL values in that column.
  - Made the column `waiter` on table `Table` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Table" ALTER COLUMN "customer" SET NOT NULL,
ALTER COLUMN "waiter" SET NOT NULL;
