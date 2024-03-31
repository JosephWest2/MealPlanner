import { MappedIngredients } from "@/types";
import KrogerCartIngredient from "./krogerCartIngredient";

export default async function KrogerCartIngredients({mappedIngredients} : {mappedIngredients: MappedIngredients | null}) {

    if (!mappedIngredients) {
        return <h4>Unable to fetch ingredient information.</h4>;
    }

    const keys = Object.keys(mappedIngredients);

    return (
        <div className="column box">
            <h2>Ingredients</h2>
            <ol className="column">
                {keys.map((ingredientName: string) => {
                    const ingredient = mappedIngredients[ingredientName];
                    return <KrogerCartIngredient locationId={null} ingredient={ingredient.cartIngredient} key={ingredientName}></KrogerCartIngredient>
                })}
            </ol>
        </div>
    )
    
}