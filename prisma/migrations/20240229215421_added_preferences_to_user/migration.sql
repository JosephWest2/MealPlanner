-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cuisine" TEXT,
ADD COLUMN     "diet" TEXT,
ADD COLUMN     "intolerances" TEXT[],
ADD COLUMN     "maxReadyTime" INTEGER,
ADD COLUMN     "mealType" TEXT,
ADD COLUMN     "nutrientLimits" TEXT[];

-- CreateTable
CREATE TABLE "Cart" (
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
