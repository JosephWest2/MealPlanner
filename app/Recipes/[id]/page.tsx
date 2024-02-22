import { MySession, authOptions } from "@/app/api/auth/[...nextauth]/route";
import Favorite from "@/components/favorite/favorite";
import { prisma } from "@/lib/prismaSingleton";
import { getServerSession } from "next-auth";
import { ProcessSummary } from "@/lib/processSummary";
import RecipeSearch from "@/components/recipeSearch/recipeSearch";
import styles from "./page.module.css";
import { Key } from "react";

export default async function RecipeDetails({params} : {params: any}) {

    const id = params.id;

    const apiKey = process.env.SPOONACULAR_API_KEY;
    const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`);
    if (!response.ok) {
        throw new Error("Failed to fetch recipes.");
    }
    const recipe = await response.json();
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n\n\n\n\n >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(recipe);

    const session = await getServerSession(authOptions) as MySession;
    let favorites = null as any;
    if (session && session.user) {
        favorites = await prisma.recipeRef.findMany({
            where: {
                userId: session.user.id
            }
        })
    }
    
    let favorited = false;
    if (favorites) {
        favorites.forEach((favorite: any) => {
            if (favorite.recipeId) {
                favorited = true;
            }
        })
    }

    return (
        <>
            <RecipeSearch session={session}></RecipeSearch>
    
            <div className={styles.recipe}>
                
                <div className={styles.header}>
                    <Favorite isFavorited={favorited} recipeId={recipe.id}></Favorite>
                    <h2>{recipe.title}</h2>
                </div>
                
                <img className={styles.image} src={recipe.image} alt="recipeImage" />
                

                <div className={styles.info}>
                    <p><b>Preparation time:</b> {recipe.readyInMinutes.toString()} minutes</p>
                    <p><b>Servings:</b> {recipe.servings.toString()}</p>
                    <div className={styles.summary} dangerouslySetInnerHTML={{__html: ProcessSummary(recipe.summary)}}></div>
                </div>
                
                
                <ul className={styles.nutrition}>
                    <li className={styles.calories} key={901293}>
                        Calories per serving: {Math.round(recipe.nutrition.nutrients[0].amount)} {recipe.nutrition.nutrients[0].unit}
                    </li>
                    <li key={99438} className={styles.servingSize}>
                        Serving size: {recipe.nutrition.weightPerServing.amount} {recipe.nutrition.weightPerServing.unit}
                    </li>
                    {recipe.nutrition.nutrients.map((nutrient: any, _key : Key) => {
                        if (nutrient.name == "Calories") { return <></> }
                        return <li key={_key}>{nutrient.name}: {nutrient.amount} {nutrient.unit}</li>
                    })}
                </ul>
                
                <ul className={styles.ingredients}>
                    <h2>Ingredients</h2>
                    {recipe.extendedIngredients.map((ingredient: any, _key : Key) => {
                        return <li className={styles.ingredient} key={_key}>{ingredient.original}</li>
                    })}
                </ul>
                <ol className={styles.instructions}>
                    <h2>Instructions</h2>
                    {recipe.analyzedInstructions[0].steps.map((step: any, _key : Key) => {
                        return <li className={styles.instruction} key={_key}>{step.step}</li>
                    })}
                </ol>
                
            </div>
        </>
    )
}