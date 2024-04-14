"use client";

import styles from "./cartIngredients.module.css"
import { CartContext } from "@/sharedComponents/cartProvider/cartProvider";
import { useContext, useState, useEffect } from "react";
import CartIngredient from "./cartIngredient";

export default function CartIngredients() {
    const { cart } = useContext(CartContext);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !cart?.ingredients) {
        return null;
    }

    const keys = Object.keys(cart.ingredients);
    keys.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return (
        <div className="column box">
            <h2>Shopping List</h2>
            <ol className={styles.ingrdeintsGrid + " column"}>
                {keys.map((ingredientName: string) => {
                    const ingredient = cart.ingredients[ingredientName];
                    return (
                        <CartIngredient
                            ingredient={ingredient}
                            key={ingredientName}
                        ></CartIngredient>
                    );
                })}
            </ol>
        </div>
    );
}
