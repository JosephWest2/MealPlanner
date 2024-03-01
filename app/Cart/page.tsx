"use client";

import { CartContext } from "@/components/cartProvider/cartProvider";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css"

export default function Cart() {

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const {cart, ToggleIngredientInclusion, RemoveRecipeFromCart, OverrideIngredient, CancelIngredientOverride} = useContext(CartContext);

    if (!cart || !isClient) {
        return <p>Cart is empty</p>
    }

    const ingredients = cart.ingredients;

    return (<>
        <h2>Recipes</h2>
        <ul>
            {cart.recipes.map((recipe, _key: number) => (
                <li key={_key}><Link href={`/recipes/${recipe.id}`}>{recipe.name}</Link> <button onClick={() => RemoveRecipeFromCart(recipe)}>Remove</button></li>
            ))}
        </ul>
        <h2>Ingredients</h2>
        <ol className={styles.ingredientContainer}>
            {Object.keys(ingredients).map((ingredientName: string, _key: number) => {

                const ingredient = ingredients[ingredientName];
                let amount = <span>{ingredient.totalAmount}</span>
                if (ingredient.override) {
                    amount = <span style={{color: "red"}}>{ingredient.overrideValue}</span>
                }

                function FormAction (formData : FormData) {

                    const doc = document as any;
                    doc.getElementById("amount" + _key).value = "";

                    const amount = formData.get("amount");
                    if (amount) {
                        OverrideIngredient(ingredientName, amount);
                    } else {
                        CancelIngredientOverride(ingredientName);
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
                    <div>
                        <label htmlFor="include">Include</label>
                        <input className={styles.ingredientCheckbox} name="include" id="include" type="checkbox" onClick={() => ToggleIngredientInclusion(ingredientName)} defaultChecked={ingredients[ingredientName].included}/>
                    </div>
                </li>
                )
            })}
        </ol>
    </>)

}