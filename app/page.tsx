import type { Key } from "react";
import RecipeComponent from "@/components/server/recipe/recipe";
import RecipeSearch from "@/components/client/recipeSearch/recipeSearch";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { readFileSync, writeFileSync, existsSync } from "fs";
import type { RecipeSearchParamStrings, Recipe, MySession } from "@/types";
import { DecodeNutrientLimits } from "@/lib/nutrientLimits";

async function SearchRecipes(params: RecipeSearchParamStrings) {

    const fileData = existsSync("./devData/devRecipes.json") ? readFileSync("./devData/devRecipes.json", "utf8") : null;
    if (process.env.NODE_ENV === "development" && fileData) {
        return JSON.parse(fileData);
    } else {
        const apiKey = process.env.SPOONACULAR_API_KEY;
        let searchParamString = `?apiKey=${apiKey}&instructionsRequired=true&sort=popularity&addRecipeInformation=true&addRecipeNutrition=true&number=20`;
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

    const recipes = await SearchRecipes(searchParams) as Array<Recipe>;
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
        <div className="column">
            <RecipeSearch></RecipeSearch>
            {recipes?.map((recipe : Recipe, _key : Key) => {
                return <div key={_key}>
                <RecipeComponent recipeData={recipe}></RecipeComponent>
            </div>
            })}
        </div>
    );
}
