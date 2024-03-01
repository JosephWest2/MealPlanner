import type { Recipe } from "@/app/page";
import Favorite from "@/components/favorite/favorite";
import { getServerSession } from "next-auth";
import { MySession, authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProcessSummary } from "@/lib/processSummary";
import Link from "next/link";
import styles from "./recipe.module.css";



export default async function Recipe({recipeData, favorites} : {recipeData: Recipe, favorites: any}) {

    const session = await getServerSession(authOptions) as MySession;

    function LoggedInContent() {
        if (session && session.user) {
            let favorited = false;
            if (favorites) {
                favorites.forEach((favorite: any) => {
                    if (favorite.recipeId === recipeData.id) {
                        favorited = true;
                    }
                })
            }
            return <Favorite isFavorited={favorited} recipeId={recipeData.id}></Favorite>
        }
        return <></>
    }

    return <div className={styles.recipeCard}>
            <div className={styles.recipeHeader}>
                {LoggedInContent()}
                <h2>{recipeData.title}</h2>
            </div>
            
            <img className={styles.recipeImage} src={recipeData.image} alt="recipeImage" />
            
            <div className={styles.recipeInfo}>
                <p><b>Preparation time:</b> {recipeData.readyInMinutes.toString()} minutes</p>
                <p><b>Servings:</b> {recipeData.servings.toString()}</p>
                <p><b>Serving size:</b> {recipeData.nutrition.weightPerServing.amount} {recipeData.nutrition.weightPerServing.unit}</p>
                <p><b>Calories per serving:</b> {Math.round(recipeData.nutrition.nutrients[0].amount)}</p>
            </div>
            
            <div className={styles.recipeSummary} dangerouslySetInnerHTML={{__html: ProcessSummary(recipeData.summary)}}></div>
            <Link className={styles.viewRecipe} href={`/recipes/${recipeData.id}`}>View Recipe</Link>
        </div>
    
}