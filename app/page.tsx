import type { Key } from "react";
import RecipeComponent from "./(components)/recipe";
import RecipeSearch from "./(components)/recipeSearch";
import type { RecipeSearchParamStrings, Recipe } from "@/types";
import { DecodeNutrientLimits } from "@/lib/nutrientLimits";

async function SearchRecipes(params: RecipeSearchParamStrings) {
    
        const apiKey = process.env.SPOONACULAR_API_KEY;
        let searchParamString = `?apiKey=${apiKey}&instructionsRequired=true&sort=popularity&addRecipeInformation=true&addRecipeNutrition=true&number=20`;
        params.query ? (searchParamString += `&query=${params.query}`) : "";
        params.mealType
            ? (searchParamString += `&type=${params.mealType}`)
            : "&type=main course";
        params.maxReadyTime
            ? (searchParamString += `&maxReadyTime=${params.maxReadyTime}`)
            : "&maxReadyTime=30";
        params.intolerances
            ? (searchParamString += `&intolerances=${params.intolerances}`)
            : "";
        params.diet ? (searchParamString += `&diet=${params.diet}`) : "";
        params.cuisine
            ? (searchParamString += `&cuisine=${params.cuisine}`)
            : "";
        if (params.nutrientLimits) {
            const nutrientLimits = DecodeNutrientLimits(params.nutrientLimits);
            Object.keys(nutrientLimits).forEach((key) => {
                searchParamString += `&${key}=${nutrientLimits[key]}`;
            });
        }
        const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch${searchParamString}`,
            { next: { revalidate: 3600 } }
        );
        if (!response.ok) {
            return "Failed to fetch recipes.";
        }
        const data = await response.json();
        return data?.results as Array<Recipe> | undefined;
}

export default async function Home({
    searchParams,
}: {
    searchParams: RecipeSearchParamStrings;
}) {

    const recipes = await SearchRecipes(searchParams);

    if (!recipes || recipes == "Failed to fetch recipes." || recipes.length == 0) {
        return <div className="column">
            <RecipeSearch></RecipeSearch>
            <h2>Unable to fetch recipes.</h2>
        </div>
    }

    return (
        <div className="column">
            <RecipeSearch></RecipeSearch>
            {recipes.map((recipe: Recipe, _key: Key) => {
                return (
                    <div key={_key}>
                        <RecipeComponent recipeData={recipe}></RecipeComponent>
                    </div>
                );
            })}
        </div>
    );
}
