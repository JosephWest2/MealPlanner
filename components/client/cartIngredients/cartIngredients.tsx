"use client";

import { CartContext } from "@/components/client/cartProvider/cartProvider";
import { useContext, useState, useEffect } from "react";
import styles from "./cartIngredients.module.css";
import { DynamicIngredients } from "@/types";


export default function CartIngredients({mapped, mappedIngredients} : {mapped: boolean, mappedIngredients: DynamicIngredients | null}) {

    const {cart, ToggleIngredientInclusion, OverrideIngredient, CancelIngredientOverride} = useContext(CartContext);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !cart?.ingredients) {
        return null;
    }

    return (
        <div className="column box">
            <h2>Ingredients</h2>
            <ol className="column">
                {Object.keys(cart.ingredients).map((ingredientName: string, _key: number) => {

                    const ingredient = cart.ingredients[ingredientName];

                    function IngredientOverrideAction (formData : FormData) {
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

                    return (
                        <li className={styles.ingredientItem} data-included={ingredient.included} key={_key}>
                            <p>{ingredientName} <span {...(ingredient.override && {style:{color: "red"}})}>{ingredient.overrideValue || ingredient.totalAmount}</span> {ingredient.unit}</p>
                            <form className="row" style={{gap: "0"}} action={IngredientOverrideAction}>
                                <input className={styles.ingredientOverrideInput} id={"amount" + _key} name="amount" type="number" min="0" {...(ingredient.override && {"data-enabled":"false", disabled:true})}/>
                                <input className={styles.ingredientOverrideSubmit} data-override={ingredient.override} type="submit" value={ingredient.override ? "Cancel" : "Override"} />
                            </form>
                            <label htmlFor="include">Include</label>
                            <input className={styles.ingredientCheckbox} name="include" id="include" type="checkbox" onClick={() => ToggleIngredientInclusion(ingredientName)} defaultChecked={cart.ingredients[ingredientName].included}/>
                        </li>
                    )
                })}
            </ol>
        </div>
    )
    
}