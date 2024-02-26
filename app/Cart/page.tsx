"use client";

import { CartContext } from "@/components/cartProvider/cartProvider";
import { useContext, useState, useEffect } from "react";

export default function Cart() {

    const {cart, ToggleIngredientInclusion, RemoveRecipeFromCart} = useContext(CartContext);


    if (!cart || !cart.count) {
        return <p>Cart is empty</p>
    }

    return (<>
        <h2>Recipes</h2>
        <ul>
            {cart.recipes.map((recipe, _key: number) => (
                <li key={_key}>{recipe.name} <button onClick={() => RemoveRecipeFromCart(recipe)}>Remove</button></li>
            ))}
        </ul>
        <h2>Ingredients</h2>
        <ol>
            {cart.ingredients.map((ingredient, _key: number) => (
                <li key={_key}>{ingredient.name} {ingredient.amount} {ingredient.unit} <input type="checkbox" onClick={() => ToggleIngredientInclusion(ingredient)} checked={ingredient.included}/></li>
            ))}
        </ol>
    </>)

}