-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "allergens" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "calories" INTEGER,
ADD COLUMN     "carbs" INTEGER,
ADD COLUMN     "cookingTime" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "fat" INTEGER,
ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVeg" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "protein" INTEGER,
ADD COLUMN     "spiceLevel" TEXT;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "role" TEXT DEFAULT 'Manager';
