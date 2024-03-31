"use client";

import { CartContext } from "@/components/client/cartProvider/cartProvider";
import { useContext, useState, useEffect } from "react";
import CartIngredient from "./cartIngredient";
import type { IngredientProvider } from "@/types";
import KrogerCartIngredient from "./krogerCartIngredient";

export default function CartIngredients({provider} : {provider:IngredientProvider}) {

    const { cart } = useContext(CartContext);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !cart?.ingredients) {
        return null;
    }

    const keys = Object.keys(cart.ingredients);

    return (
        <div className="column box">
            <h2>Ingredients</h2>
            <ol className="column">
                {keys.map((ingredientName: string) => {
                    const ingredient = cart.ingredients[ingredientName];
                    if (provider && provider.providerName === "Kroger") {
                        return <KrogerCartIngredient provider={provider} ingredient={ingredient} key={ingredientName}></KrogerCartIngredient>
                    }
                    return <CartIngredient ingredient={ingredient} key={ingredientName}></CartIngredient>
                })}
            </ol>
        </div>
    )
    
}