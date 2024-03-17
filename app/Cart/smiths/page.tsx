"use client";

import { CartContext } from "@/components/client/cartProvider/cartProvider";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css"
import type { CartRecipe, Cart } from "@/types";

export default function Cart() {

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const {cart, ToggleIngredientInclusion, RemoveRecipeFromCart, OverrideIngredient, CancelIngredientOverride} = useContext(CartContext);

    if (!cart || !isClient || cart.recipes.length == 0 || !cart.ingredients || Object.keys(cart.ingredients).length == 0) {
        return <div className="box column">
            <h2>Cart is Empty</h2>
            <Link className="btn" href="/">Return to recipes</Link>
        </div>
    }

    const ingredients = cart.ingredients;

    return (<div className="column">
        <div className="column box">
            <h2>Recipes</h2>
            <ul className="column">
                {cart.recipes.map((recipe: CartRecipe, _key: number) => (
                    <li className="row" key={_key}><p>• {recipe.name}</p><Link className="btn" href={`/recipes/${recipe.id}`}>View Recipe</Link> <button onClick={() => RemoveRecipeFromCart(recipe)}>Remove</button></li>
                ))}
            </ul>
        </div>
        <div className="column box">
            <h2>Ingredients</h2>
            <ol className="column">
                {Object.keys(ingredients).map((ingredientName: string, _key: number) => {

                    const ingredient = ingredients[ingredientName];
                    let amount = <span>{ingredient.totalAmount}</span>
                    if (ingredient.override) {
                        amount = <span style={{color: "red"}}>{ingredient.overrideValue}</span>
                    }

                    function FormAction (formData : FormData) {
                        const amount = formData.get("amount");
                        if (amount) {
                            OverrideIngredient(ingredientName, amount);
                        } else {
                            CancelIngredientOverride(ingredientName);
                        }
                        const element = document.getElementById("amount" + _key) as HTMLInputElement;
                        if (element) {
                            element.value = "";
                        }
                    }

                    let overrideAmountInput;
                    if (ingredient.override) {
                        overrideAmountInput = <input className={styles.ingredientOverrideInput} id={"amount" + _key} name="amount" type="number" min="0" data-enabled="false" disabled/>
                    } else {
                        overrideAmountInput = <input className={styles.ingredientOverrideInput} id={"amount" + _key} name="amount" type="number" min="0" />
                    }

                    return (
                    <li className={styles.ingredientItem} data-included={ingredient.included} key={_key}>
                        <p>{ingredientName} {amount} {ingredient.unit}</p>
                        <form className={styles.ingredientOverrideForm} action={FormAction}>
                            {overrideAmountInput}
                            <input className={styles.ingredientOverrideSubmit} data-override={ingredient.override} type="submit" value={ingredient.override ? "Cancel" : "Override"} />
                        </form>
                        <label htmlFor="include">Include</label>
                        <input className={styles.ingredientCheckbox} name="include" id="include" type="checkbox" onClick={() => ToggleIngredientInclusion(ingredientName)} defaultChecked={ingredients[ingredientName].included}/>
                    </li>
                    )
                })}
            </ol>

            <Link className="btn" href="/cart/smiths">Add to Smiths cart</Link>
        </div>

        
        
    </div>)

}