import { MySession, authOptions } from "@/app/api/auth/[...nextauth]/route";
import Favorite from "@/components/favorite/favorite";
import { prisma } from "@/lib/prismaSingleton";
import { getServerSession } from "next-auth";
import { ProcessSummary } from "@/lib/processSummary";
import RecipeSearch from "@/components/recipeSearch/recipeSearch";
import styles from "./page.module.css";
import { readFileSync, writeFileSync, existsSync } from "fs";
import AddToCart from "@/components/addToCart/addToCart";

export default async function RecipeDetails({params} : {params: any}) {


    async function GetRecipe() {
        const id = params.id;
        const fileData = existsSync("./devData/devRecipe.json") ? readFileSync("./devData/devRecipe.json", "utf8") : null;
        if (process.env.NODE_ENV === "development" && fileData) {
            const _recipe = JSON.parse(fileData);
            console.log(_recipe);
            console.log(_recipe.nutrition.ingredients[0])
            return JSON.parse(fileData);
        } else {
            const apiKey = process.env.SPOONACULAR_API_KEY;
            const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}&includeNutrition=true`, {next: {revalidate: 3600}});
            if (!response.ok) {
                throw new Error("Failed to fetch recipes.");
            }
            const _recipe = await response.json();
            console.log(_recipe);
            writeFileSync("./devData/devRecipe.json", JSON.stringify(_recipe), "utf8");
            return _recipe;
        }
    }

    const session = await getServerSession(authOptions) as MySession;
    const recipe = await GetRecipe();

    async function LoggedInContent() {
        
        if (!session || !session.user) {
            return <></>
        }

        let favorites = await prisma.recipeRef.findMany({
            where: {
                userId: session.user.id
            }
        })
        
        let favorited = false;
        if (favorites) {
            favorites.forEach((favorite: any) => {
                console.log(favorite.recipeId);
                if (favorite.recipeId == recipe.id) {
                    favorited = true;
                }
            })
        }

        return <Favorite isFavorited={favorited} recipeId={recipe.id}></Favorite>
    }
    

    return (
        <>
            <RecipeSearch session={session}></RecipeSearch>
    
            <div className={styles.recipe}>
                
                <div className={styles.header}>
                    {LoggedInContent()}
                    <h2>{recipe.title}</h2>
                </div>
                
                <img className={styles.image} src={recipe.image} alt="recipeImage" />
                

                <div className={styles.info}>
                    <p><b>Preparation time:</b> {recipe.readyInMinutes.toString()} minutes</p>
                    <p><b>Servings:</b> {recipe.servings.toString()}</p>
                    <div className={styles.summary} dangerouslySetInnerHTML={{__html: ProcessSummary(recipe.summary)}}></div>
                </div>
                
                
                <ul className={styles.nutrition}>
                    <li className={styles.calories}>
                        Calories per serving: {Math.round(recipe.nutrition.nutrients[0].amount)} {recipe.nutrition.nutrients[0].unit}
                    </li>
                    <li className={styles.servingSize}>
                        Serving size: {recipe.nutrition.weightPerServing.amount} {recipe.nutrition.weightPerServing.unit}
                    </li>
                    {recipe.nutrition.nutrients.map((nutrient: any, i : number) => {
                        if (nutrient.name == "Calories") { return <></> }
                        return <li key={i}>{nutrient.name}: {nutrient.amount} {nutrient.unit}</li>
                    })}
                </ul>
                
                <ul className={styles.ingredients}>
                    <h2>Ingredients</h2>
                    {recipe.extendedIngredients.map((ingredient: any, i : number) => {
                        return <li className={styles.ingredient} key={i}>{ingredient.original}</li>
                    })}
                </ul>
                <ol className={styles.instructions}>
                    <h2>Instructions</h2>
                    {recipe.analyzedInstructions[0].steps.map((step: any, i : number) => {
                        return <li className={styles.instruction} key={i}>{step.step}</li>
                    })}
                </ol>

                <AddToCart recipe={recipe}></AddToCart>
                
            </div>
        </>
    )
}