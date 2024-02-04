import type { Key } from "react";

async function getRecipes() {
    const apiKey = process.env.SPOONACULAR_API_KEY;

    let mealType = "main course";
    let maxReadyTime = "30";
    const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&type=${mealType}&maxReadyTime=${maxReadyTime}&instructionsRequired=true&addRecipeInformation=true&addRecipeNutrition=true&number=10`,
        {cache: "no-store"}
        );
    if (!response.ok) {
        throw new Error("Failed to fetch recipes.");
    }
    const data = await response.json();
    console.log(data);
    const results = data?.results;
    return results;
}

export default async function Recipes() {

    const recipes = await getRecipes();

    return (
        <>
            {recipes?.map((recipe : Recipe, _key : Key) => {
                return <div key={_key}>
                        <h2>{recipe.title}</h2>
                        <div dangerouslySetInnerHTML={{__html: recipe.summary}}></div>
                    </div>
            })}
        </>
        
    );
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