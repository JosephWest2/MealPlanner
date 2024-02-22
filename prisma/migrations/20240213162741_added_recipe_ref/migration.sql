-- CreateTable
CREATE TABLE "RecipeRef" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "RecipeRef_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeRef" ADD CONSTRAINT "RecipeRef_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
