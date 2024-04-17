import { ProcessSummary } from "@/lib/processSummary";
import styles from "./page.module.css";
import AddToCart from "./(components)/addToCart";
import { Recipe } from "@/types";

async function GetRecipe(id: string) {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const response = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`,
        { next: { revalidate: 3600 } }
    );
    if (!response.ok) {
        return "Failed to fetch recipe";
    }
    const _recipe = await response.json();
    return _recipe as Recipe | undefined;
}

export default async function RecipeDetails({
    params,
}: {
    params: { id: string };
}) {
    
    const recipe = await GetRecipe(params.id)
    if (!recipe || recipe === "Failed to fetch recipe" || !recipe.id) {
        return <h2 className="box column">Unable to fetch recipe</h2>;
    }

    let instructions = <p>Instructions not found</p>;
    if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
        instructions = <>{recipe.analyzedInstructions[0].steps.map((step, i) => {
            return (
                <li className={styles.instruction} key={i}>
                    {step.step}
                </li>
            );
        })}
        </>
    } else if (recipe.instructions) {
        instructions = <p>{recipe.instructions}</p>
    }

    return (
        <>
            <div className={styles.recipe}>
                <h2 className={styles.header}>{recipe.title}</h2>

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
                        {Math.round(
                            Number(recipe.nutrition.nutrients[0].amount)
                        )}{" "}
                        <span style={{ color: "grey" }}>per serving</span>
                    </h3>
                    <h4 className={styles.servingSize}>
                        Serving size: {recipe.nutrition.weightPerServing.amount}{" "}
                        {recipe.nutrition.weightPerServing.unit}
                    </h4>
                    <div className={styles.nutrient}>
                        {recipe.nutrition.nutrients.map((nutrient, i) => {
                            if (nutrient.name == "Calories") {
                                return <></>;
                            }
                            return (
                                <>
                                    <p key={nutrient.name + 1}>
                                        {nutrient.name}
                                    </p>
                                    <p key={nutrient.name + 2}>
                                        {nutrient.amount} {nutrient.unit}
                                    </p>
                                </>
                            );
                        })}
                    </div>
                </div>

                <ul className={styles.ingredients + " box"}>
                    <h2>Ingredients</h2>
                    {recipe.extendedIngredients.map((ingredient, i) => {
                        return (
                            <li className={styles.ingredient} key={i}>
                                {ingredient.original}
                            </li>
                        );
                    })}
                </ul>
                <ol className={styles.instructions + " box"}>
                    <h2>Instructions</h2>
                    {instructions}
                </ol>
            </div>
            <AddToCart recipe={recipe}></AddToCart>
        </>
    );
}
