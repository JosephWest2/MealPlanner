"use client";

import type { CartIngredient } from "@/types";
import { useContext, useState } from "react";
import { CartContext } from "@/components/client/cartProvider/cartProvider";
import styles from "./cartIngredients.module.css";

export default function CartIngredient({ingredient} : {ingredient: CartIngredient}) {

    const {ToggleIngredientInclusion, OverrideIngredient, CancelIngredientOverride} = useContext(CartContext);
    const [overrideAmount, setOverrideAmount] = useState<number>(0);

    function Override() {
        if (ingredient.override) {
            CancelIngredientOverride(ingredient.name);
        } else {
            OverrideIngredient(ingredient.name, overrideAmount);
        }
        setOverrideAmount(0);
    }

    return (
        <li className={styles.ingredientItem} data-included={ingredient.included}>
            <p>{ingredient.name} <span {...(ingredient.override && {style:{color: "red"}})}>{ingredient.overrideValue || Math.round(ingredient.totalAmount*10)/10}</span> {ingredient.unit}</p>
            <div className="row" style={{gap: "0"}}>
                <input value={overrideAmount !== 0 ? overrideAmount : ""} onChange={(e) => setOverrideAmount(Number(e.target.value))} className={styles.ingredientOverrideInput}  type="number" min="0" {...(ingredient.override && {"data-enabled":"false", disabled:true})}/>
                <button onClick={Override} className={styles.ingredientOverrideSubmit} data-override={ingredient.override}>{ingredient.override ? "Cancel" : "Edit"}</button>
            </div>
            <label htmlFor="include">Include</label>
            <input className={styles.ingredientCheckbox} name="include" id="include" type="checkbox" onClick={() => ToggleIngredientInclusion(ingredient.name)} defaultChecked={ingredient.included || false}/>
        </li>
    )
}