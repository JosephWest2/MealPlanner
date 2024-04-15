"use client";

import type { CartIngredient } from "@/types";
import { useContext, useState } from "react";
import { CartContext } from "@/sharedComponents/cartProvider/cartProvider";
import styles from "./cartIngredient.module.css";

export default function CartIngredient({
    ingredient,
    ingredientName,
}: {
    ingredient: CartIngredient;
    ingredientName: string;
}) {
    const {
        ToggleIngredientInclusion,
        OverrideIngredient,
        CancelIngredientOverride,
    } = useContext(CartContext);
    const [overrideValue, setOverrideValue] = useState<string>();

    function Override() {
        if (ingredient.override && CancelIngredientOverride) {
            CancelIngredientOverride(ingredientName);
        } else if (OverrideIngredient && overrideValue) {
            OverrideIngredient(ingredientName, overrideValue);
        }
        setOverrideValue("");
    }

    const _ingredients = {} as {[unit: string]: number};
    ingredient.recipeIngredients.forEach((i) => {
        if (_ingredients[i.unit]) {
            _ingredients[i.unit] += i.amount;
        } else {
            _ingredients[i.unit] = i.amount;
        }
    })

    const recipeIngredients = Object.keys(_ingredients).map((unit, i) => {
        if (i === 0) {
            return _ingredients[unit] + " " + unit;
        } else {
            return " + " + _ingredients[unit] + " " + unit;
        }
    });

    return (
        <li
            className={styles.ingredient}
            data-included={ingredient.included}
        >
            <p className={styles.name}>{ingredientName}</p>
            <p
                className={styles.amount}
                data-override={ingredient.override}
            >
                {ingredient.overrideValue || recipeIngredients}
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
                onClick={() => ToggleIngredientInclusion ? ToggleIngredientInclusion(ingredientName) : null}
                defaultChecked={ingredient.included || false}
            />
        </li>
    );
}
