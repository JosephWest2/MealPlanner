import { ProcessSummary } from "@/lib/processSummary";
import styles from "./page.module.css";
import { readFileSync, writeFileSync, existsSync } from "fs";
import AddToCart from "./(components)/addToCart";

export default async function RecipeDetails({ params }: { params: any }) {
    async function GetRecipe() {
        const id = params.id;
        const fileData = existsSync("./devData/devRecipe.json")
            ? readFileSync("./devData/devRecipe.json", "utf8")
            : null;
        if (process.env.NODE_ENV === "development" && fileData) {
            const _recipe = JSON.parse(fileData);
            return JSON.parse(fileData);
        } else {
            const apiKey = process.env.SPOONACULAR_API_KEY;
            const response = await fetch(
                `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`,
                { next: { revalidate: 3600 } }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch recipes.");
            }
            const _recipe = await response.json();
            writeFileSync(
                "./devData/devRecipe.json",
                JSON.stringify(_recipe),
                "utf8"
            );
            return _recipe;
        }
    }

    const recipe = await GetRecipe();

    return (
        <>
            <div className={styles.recipe}>
                <div className={styles.header}>
                    <h2>{recipe.title}</h2>
                </div>

                <img
                    className={styles.image + " box"}
                    src={recipe.image}
                    alt="recipeImage"
                />

                <div className={styles.info + " box"}>
                    <p>
                        <b>Preparation time:</b>{" "}
                        {recipe.readyInMinutes.toString()} minutes
                    </p>
                    <p>
                        <b>Servings:</b> {recipe.servings.toString()}
                    </p>
                    <div className={styles.summary}>
                        {ProcessSummary(recipe.summary)}
                    </div>
                </div>

                <div className={styles.nutrition + " box column"}>
                    <h3 className={styles.calories}>
                        Calories:{" "}
                        {Math.round(recipe.nutrition.nutrients[0].amount)} <span style={{color: "grey"}}>per serving</span>
                    </h3>
                    <h4 className={styles.servingSize}>
                        Serving size: {recipe.nutrition.weightPerServing.amount}{" "}
                        {recipe.nutrition.weightPerServing.unit}
                    </h4>
                    <div className={styles.nutrient}>
                        {recipe.nutrition.nutrients.map(
                            (nutrient: any, i: number) => {
                                if (nutrient.name == "Calories") {
                                    return <></>;
                                }
                                return (
                                    <>
                                        <p>{nutrient.name}</p>
                                        <p>
                                            {nutrient.amount} {nutrient.unit}
                                        </p>
                                    </>
                                );
                            }
                        )}
                    </div>
                </div>

                <ul className={styles.ingredients + " box"}>
                    <h2>Ingredients</h2>
                    {recipe.extendedIngredients.map(
                        (ingredient: any, i: number) => {
                            return (
                                <li className={styles.ingredient} key={i}>
                                    {ingredient.original}
                                </li>
                            );
                        }
                    )}
                </ul>
                <ol className={styles.instructions + " box"}>
                    <h2>Instructions</h2>
                    {recipe.analyzedInstructions[0].steps.map(
                        (step: any, i: number) => {
                            return (
                                <li className={styles.instruction} key={i}>
                                    {step.step}
                                </li>
                            );
                        }
                    )}
                </ol>
            </div>
            <AddToCart recipe={recipe}></AddToCart>
        </>
    );
}
