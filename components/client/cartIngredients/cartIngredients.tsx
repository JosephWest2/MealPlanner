"use client";

import { CartContext } from "@/components/client/cartProvider/cartProvider";
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

    return (
        <div className="column box">
            <h2>Shopping List</h2>
            <ol className="column">
                {keys.map((ingredientName: string) => {
                    const ingredient = cart.ingredients[ingredientName];
                    return <CartIngredient ingredient={ingredient} key={ingredientName}></CartIngredient>
                })}
            </ol>
        </div>
    )
    
}