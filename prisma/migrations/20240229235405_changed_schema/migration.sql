-- AlterTable
ALTER TABLE "User" ALTER COLUMN "nutrientLimits" DROP NOT NULL,
ALTER COLUMN "nutrientLimits" SET DATA TYPE TEXT;
