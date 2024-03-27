"use client";

import { CartContext } from "@/components/client/cartProvider/cartProvider";
import { useContext, useState, useEffect } from "react";
import getNearestKrogerStore from "@/app/actions/getNearestKrogerStore";
import Link from "next/link";
import type { CartRecipe, Cart } from "@/types";
import CartIngredients from "@/components/client/cartIngredients/cartIngredients";

export default function Cart() {

    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, []);

    const {cart, RemoveRecipeFromCart} = useContext(CartContext);

    if (!cart || !isClient || cart.recipes.length == 0 || !cart.ingredients || Object.keys(cart.ingredients).length == 0) {
        return <div className="box column">
            <h2>Cart is Empty</h2>
            <Link className="btn" href="/">Return to recipes</Link>
        </div>
    }

    return (<div className="column">
        <div className="column box">
            <h2>Recipes</h2>
            <ul className="column">
                {cart.recipes.map((recipe: CartRecipe, _key: number) => (
                    <li className="row" key={_key}><p>• {recipe.name}</p><Link className="btn" href={`/recipes/${recipe.id}`}>View Recipe</Link> <button onClick={() => RemoveRecipeFromCart(recipe)}>Remove</button></li>
                ))}
            </ul>
        </div>
        <CartIngredients mapped={false} mappedIngredients={null}></CartIngredients>
        <Link className="btn" href="/cart/kroger">Continue with Kroger</Link>

    </div>)

}