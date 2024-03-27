import type { Recipe } from "@/types";
import { ProcessSummary } from "@/lib/processSummary";
import Link from "next/link";
import styles from "./recipe.module.css";



export default async function RecipeComponent({recipeData} : {recipeData: Recipe}) {


    return <div className={styles.recipeGrid + " box"}>
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