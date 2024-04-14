"use client";

import type { CartIngredient } from "@/types";
import { useContext, useState } from "react";
import { CartContext } from "@/sharedComponents/client/cartProvider/cartProvider";
import styles from "./cartIngredient.module.css";

export default function CartIngredient({
    ingredient,
}: {
    ingredient: CartIngredient;
}) {
    const {
        ToggleIngredientInclusion,
        OverrideIngredient,
        CancelIngredientOverride,
    } = useContext(CartContext);
    const [overrideValue, setOverrideValue] = useState<string>();

    function Override() {
        if (ingredient.override) {
            CancelIngredientOverride(ingredient.name);
        } else {
            OverrideIngredient(ingredient.name, overrideValue);
        }
        setOverrideValue("");
    }

    const recipeIngredeints = ingredient.recipeIngredients.map((ri, i) => {
        if (i === 0) {
            return ri.amount + " " + ri.unit;
        } else {
            return " + " + ri.amount + " " + ri.unit;
        }
    });

    return (
        <li
            className={styles.ingredient}
            data-included={ingredient.included}
        >
            <p className={styles.name}>{ingredient.name}</p>
            <p
                className={styles.amount}
                data-override={ingredient.override}
            >
                {ingredient.overrideValue || recipeIngredeints}
            </p>
            <div
                className={styles.override}
                data-override={ingredient.override}
            >
                <input
                    value={overrideValue}
                    onChange={(e) => setOverrideValue(e.target.value)}
                    className={styles.ingredientOverrideInput}
                    type="text"
                    min="0"
                    {...(ingredient.override && {
                        "data-enabled": "false",
                        disabled: true,
                    })}
                />
                <button
                    onClick={Override}
                    className={styles.ingredientOverrideSubmit}
                    data-override={ingredient.override}
                >
                    {ingredient.override ? "Cancel" : "Edit"}
                </button>
            </div>
            <input
                className={styles.checkbox}
                name="include"
                id="include"
                type="checkbox"
                onClick={() => ToggleIngredientInclusion(ingredient.name)}
                defaultChecked={ingredient.included || false}
            />
        </li>
    );
}
