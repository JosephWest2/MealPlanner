import type { Key } from "react";
import RecipeSearch from "./recipeSearch";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

async function SearchRecipes(params: RecipeSearchParams) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        params.showFavorites = "false";
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;
    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${params.searchString ? params.searchString : ""}&type=${params.mealType ? params.mealType : "main course"}&maxReadyTime=${params.maxReadyTime ? params.maxReadyTime : "30"}&instructionsRequired=true&sort=popularity&addRecipeInformation=true&addRecipeNutrition=true&number=30`);
    if (!response.ok) {
        throw new Error("Failed to fetch recipes.");
    }
    const data = await response.json();
    console.log(data);
    return data?.results;
}

function ProcessSummary(summary: string) {
    let output = summary;
    let i = output.indexOf("<a");
    if (i !== -1) {
        output = output.substring(0, i);
    }
    i = output.lastIndexOf("spoonacular");
    if (i !== -1) {
        output = output.substring(0, i);
    }
    i = output.lastIndexOf(".");
    if (i !== -1) {
        output = output.substring(0, i+1);
    }
    return output;
}

export default async function Recipes({searchParams} : {searchParams: RecipeSearchParams}) {

    const session = await getServerSession(authOptions);
    const recipes = await SearchRecipes(searchParams);

    return (
        <>
            <RecipeSearch session={session}></RecipeSearch>
            {recipes?.map((recipe : Recipe, _key : Key) => {
                return <div key={_key}>
                        <h2>{recipe.title}</h2>
                        <img src={recipe.image} alt="recipeImage" />
                        <p>Preparation time: {recipe.readyInMinutes.toString()} minutes</p>
                        <p>Servings: {recipe.servings.toString()}</p>
                        <p>Nutrition: {recipe.nutrition.toString()}</p>
                        <div dangerouslySetInnerHTML={{__html: ProcessSummary(recipe.summary)}}></div>
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
type Recipe = {
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
    nutrition: {},
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