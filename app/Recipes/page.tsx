import type { Key } from "react";
import Recipe from "@/components/recipe/recipe";
import RecipeSearch from "@/components/recipeSearch/recipeSearch";
import { prisma } from "@/lib/prismaSingleton";
import { getServerSession } from "next-auth";
import { MySession, authOptions } from "@/app/api/auth/[...nextauth]/route";
import { readFileSync, writeFileSync, existsSync } from "fs";

async function SearchRecipes(params: any) {

    const fileData = existsSync("./devData/devRecipes.json") ? readFileSync("./devData/devRecipes.json", "utf8") : null;
    if (process.env.NODE_ENV === "development" && fileData) {
        return JSON.parse(fileData);
    } else {
        const apiKey = process.env.SPOONACULAR_API_KEY;
        let searchParamString = `?apiKey=${apiKey}&instructionsRequired=true&sort=popularity&addRecipeInformation=true&addRecipeNutrition=true&number=50`;
        params.searchString ? searchParamString += `&query=${params.searchString}` : "";
        params.mealType ? searchParamString += `&type=${params.mealType}` : "&type=main course";
        params.maxReadyTime ? searchParamString += `&maxReadyTime=${params.maxReadyTime}` : "&maxReadyTime=30";
        params.intolerances ? searchParamString += `&intolerances=${params.intolerances}` : "";
        params.diet ? searchParamString += `&diet=${params.diet}` : "";
        params.cuisine ? searchParamString += `&cuisine=${params.cuisine}` : "";
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch${searchParamString}`,
        {next: {revalidate: 3600}});
        if (!response.ok) {
            console.log(response.status);
            throw new Error("Failed to fetch recipes.");
        }
        const data = await response.json();
        writeFileSync("./devData/devRecipes.json", JSON.stringify(data.results), "utf8");
        return data?.results;
    }
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

    console.log(favorites);
    const recipes = await SearchRecipes(searchParams) as Array<Recipe>;
    console.log(recipes[0]);
    let unitsArray = existsSync("./devData/units.json") ? JSON.parse(readFileSync("./devData/units.json", "utf8")) : null;
    let units = new Set<string>();
    if (unitsArray) {
        units = new Set<string>(unitsArray);
    }
    recipes.forEach((recipe: Recipe) => {
        for (let i=0; i < recipe.nutrition.ingredients.length; i++) {
            units.add(recipe.nutrition.ingredients[i].unit);
        }
    })
    unitsArray = Array.from(units.values());
    writeFileSync("./devData/units.json", JSON.stringify(unitsArray), "utf8");

    return (
        <>
            <RecipeSearch session={session}></RecipeSearch>
            {recipes?.map((recipe : Recipe, _key : Key) => {
                if (session && session.user && searchParams.showFavorites === "true") {
                    for (let i = 0; i < favorites.length; i++) {
                        if (favorites[i].recipeId === recipe.id) {
                            return <div key={_key}>
                                <Recipe favorites={favorites} recipeData={recipe}></Recipe>
                            </div>
                        }
                    }
                    return <></>
                    
                } else {
                    return <div key={_key}>
                        <Recipe favorites={favorites} recipeData={recipe}></Recipe>
                    </div>
                }
                
            })}
        </>
        
    );
}
type RecipeSearchParams = {
    searchString: string | undefined,
    mealType: string | undefined,
    maxReadyTime: Number | undefined,
    showFavorites: string | undefined,
    intolerances: string | undefined,
    diet: string | undefined,
    cuisine: string | undefined,
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
    extendedIngredients: Ingredient[],
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

export type Ingredient = {
    id: number,
    aisle: string,
    image: string,
    consistency: string,
    name: string,
    nameClean: string,
    original: string,
    originalName: string,
    amount: number,
    unit: string,
    meta: [],
    measures: [Object]
}

export type Nutrition = {
    nutrients: []
    properties: []
    flavonoids: []
    ingredients: NutritionIngredient[]
}

export type NutritionIngredient = {
    id: number
    name: string
    amount: number
    unit: string
    nutrients: []
}