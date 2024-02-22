import type { Key } from "react";
import RecipeOverview from "@/components/recipe/recipeOverview";
import RecipeSearch from "@/components/recipeSearch/recipeSearch";
import { prisma } from "@/lib/prismaSingleton";
import { getServerSession } from "next-auth";
import { MySession, authOptions } from "@/app/api/auth/[...nextauth]/route";

async function SearchRecipes(params: RecipeSearchParams) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        params.showFavorites = "false";
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${params.searchString ? params.searchString : ""}&type=${params.mealType ? params.mealType : "main course"}&maxReadyTime=${params.maxReadyTime ? params.maxReadyTime : "30"}&instructionsRequired=true&sort=popularity&addRecipeInformation=true&addRecipeNutrition=true&number=30`,
    {next: {revalidate: 3600}});
    if (!response.ok) {
        console.log(response.status);
        throw new Error("Failed to fetch recipes.");
    }
    const data = await response.json();
    console.log(data);
    return data?.results;
}


export default async function Recipes({searchParams} : {searchParams: RecipeSearchParams}) {

    const session = await getServerSession(authOptions) as MySession;
    let favorites = null as any;
    if (session && session.user) {
        favorites = await prisma.recipeRef.findMany({
            where: {
                userId: session.user.id
            }
        })
    }

    
    const recipes = await SearchRecipes(searchParams);

    return (
        <>
            <RecipeSearch session={session}></RecipeSearch>
            {recipes?.map((recipe : Recipe, _key : Key) => {
                return <div key={_key}>
                        <RecipeOverview favorites={favorites} recipeData={recipe}></RecipeOverview>
                    </div>
            })}
        </>
        
    );
}
type RecipeSearchParams = {
    searchString: string | undefined,
    mealType: string | undefined,
    maxReadyTime: Number | undefined,
    showFavorites: string | undefined
}
export type Recipe = {
    vegetarian: boolean,
    vegan: boolean,
    glutenFree: boolean,
    dairyFree:boolean,
    veryHealthy: boolean,
    cheap: boolean,
    veryPopular: boolean,
    sustainable: boolean,
    lowFodmap: boolean,
    weightWatcherSmartPoints: Number,
    gaps: string,
    preparationMinutes: Number,
    cookingMinutes: Number,
    aggregateLikes: Number,
    healthScore: Number,
    creditsText: string,
    license: string,
    nutrition: any,
    sourceName: string,
    pricePerServing: Number,
    extendedIngredients: [],
    id: number,
    title: string,
    readyInMinutes: Number,
    servings: Number,
    sourceUrl: string,
    image: string,
    imageType: string,
    summary: string,
    cuisines: [],
    dishTypes: [],
    diets: [],
    occasions: [],
    instructions: string
    analyzedInstructions: [],
    originalId: Number | null,
    spoonacularScore: Number,
    spoonacularSourceUrl: string
}