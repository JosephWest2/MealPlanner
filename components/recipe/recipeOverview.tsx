import type { Recipe } from "../../app/Recipes/page";
import Favorite from "../favorite/favorite";
import { getServerSession } from "next-auth";
import { MySession, authOptions } from "../../app/api/auth/[...nextauth]/route";
import { ProcessSummary } from "@/lib/processSummary";
import styles from "./recipeOverview.module.css";



export default async function RecipeOverview({recipeData, favorites} : {recipeData: Recipe, favorites: any}) {

    const session = await getServerSession(authOptions) as MySession;

    if (!session || !session.user) {

        return <>
            <h2>{recipeData.title}</h2>
            <img src={recipeData.image} alt="recipeImage" />
            <p>Preparation time: {recipeData.readyInMinutes.toString()} minutes</p>
            <p>Servings: {recipeData.servings.toString()}</p>
            <p>Nutrition: {recipeData.nutrition.toString()}</p>
            <div dangerouslySetInnerHTML={{__html: ProcessSummary(recipeData.summary)}}></div>
        </>
        
    } else {

        let favorited = false;
        if (favorites) {
            favorites.forEach((favorite: any) => {
                if (favorite.recipeId === recipeData.id) {
                    favorited = true;
                }
            })
        }

        return <div className={styles.recipeCard}>
            <div className={styles.recipeHeader}>
                <Favorite isFavorited={favorited} recipeId={recipeData.id}></Favorite>
                <h2>{recipeData.title}</h2>
            </div>
            
            <img className={styles.recipeImage} src={recipeData.image} alt="recipeImage" />
            
            <div className={styles.recipeInfo}>
                <p><b>Preparation time:</b> {recipeData.readyInMinutes.toString()} minutes</p>
                <p><b>Servings:</b> {recipeData.servings.toString()}</p>
                <p><b>Calories per serving:</b> {Math.round(recipeData.nutrition.nutrients[0].amount)}</p>
            </div>
            
            <div className={styles.recipeSummary} dangerouslySetInnerHTML={{__html: ProcessSummary(recipeData.summary)}}></div>
        </div>

    }
    
}