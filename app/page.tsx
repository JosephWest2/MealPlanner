import type { Key } from "react";
import RecipeComponent from "@/components/server/recipe/recipe";
import RecipeSearch from "@/components/client/recipeSearch/recipeSearch";
import { prisma } from "@/lib/prismaSingleton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { readFileSync, writeFileSync, existsSync } from "fs";
import type { RecipeSearchParamStrings, Recipe, MySession } from "@/types";
import { DecodeNutrientLimits, GetPreferences } from "@/lib/getPreferences";

async function SearchRecipes(params: RecipeSearchParamStrings) {

    const fileData = existsSync("./devData/devRecipes.json") ? readFileSync("./devData/devRecipes.json", "utf8") : null;
    if (process.env.NODE_ENV === "development" && fileData) {
        return JSON.parse(fileData);
    } else {
        const apiKey = process.env.SPOONACULAR_API_KEY;
        let searchParamString = `?apiKey=${apiKey}&instructionsRequired=true&sort=popularity&addRecipeInformation=true&addRecipeNutrition=true&number=50`;
        params.query ? searchParamString += `&query=${params.query}` : "";
        params.mealType ? searchParamString += `&type=${params.mealType}` : "&type=main course";
        params.maxReadyTime ? searchParamString += `&maxReadyTime=${params.maxReadyTime}` : "&maxReadyTime=30";
        params.intolerances ? searchParamString += `&intolerances=${params.intolerances}` : "";
        params.diet ? searchParamString += `&diet=${params.diet}` : "";
        params.cuisine ? searchParamString += `&cuisine=${params.cuisine}` : "";
        if (params.nutrientLimits) {
            const nutrientLimits = DecodeNutrientLimits(params.nutrientLimits);
            Object.keys(nutrientLimits).forEach(key => {
                searchParamString += `&${key}=${nutrientLimits[key]}`
            })
        }
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

export default async function Home({searchParams} : {searchParams: RecipeSearchParamStrings}) {

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

    const preferences = await GetPreferences(session);

    return (
        <div className="column">
            <RecipeSearch session={session} preferences={preferences}></RecipeSearch>
            {recipes?.map((recipe : Recipe, _key : Key) => {
                if (session && session.user && searchParams.onlyFavorites === "true") {
                    for (let i = 0; i < favorites.length; i++) {
                        if (favorites[i].recipeId === recipe.id) {
                            return <div key={_key}>
                                <RecipeComponent favorites={favorites} recipeData={recipe}></RecipeComponent>
                            </div>
                        }
                    }
                    return <></>
                    
                } else {
                    return <div key={_key}>
                        <RecipeComponent favorites={favorites} recipeData={recipe}></RecipeComponent>
                    </div>
                }
                
            })}
        </div>
    );
}
