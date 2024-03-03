import type { Recipe } from "@/types";
import Favorite from "@/components/client/favorite/favorite";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ProcessSummary } from "@/lib/processSummary";
import Link from "next/link";
import styles from "./recipe.module.css";
import type { MySession } from "@/types";



export default async function RecipeComponent({recipeData, favorites} : {recipeData: Recipe, favorites: any}) {

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
            return <Favorite className={styles.favorite} isFavorited={favorited} recipeId={recipeData.id}></Favorite>
        }
        return <></>
    }

    return <div className={styles.recipeGrid + " box"}>
            {LoggedInContent()}
            <h2 className={styles.header}>{recipeData.title}</h2>
            
            <img className={styles.image} src={recipeData.image} alt="recipeImage" />
            
            <div className={styles.info + " column"}>
                <p><b>Preparation time:</b> {recipeData.readyInMinutes.toString()} minutes</p>
                <p><b>Servings:</b> {recipeData.servings.toString()}</p>
                <p><b>Serving size:</b> {recipeData.nutrition.weightPerServing.amount} {recipeData.nutrition.weightPerServing.unit}</p>
                <p><b>Calories per serving:</b> {Math.round(recipeData.nutrition.nutrients[0].amount)}</p>
            </div>
            
            <div className={styles.summary} dangerouslySetInnerHTML={{__html: ProcessSummary(recipeData.summary)}}></div>
            <Link className={styles.link + " btn"} href={`/recipes/${recipeData.id}`}>View Recipe</Link>
        </div>
    
}