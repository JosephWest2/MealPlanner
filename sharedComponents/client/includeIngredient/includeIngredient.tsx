"use client";

import { useState, useContext } from "react";
import { CartContext } from "../cartProvider/cartProvider";

export default function IncludeIngredient({ingredient}: {ingredient: any}) {

    const {cart, AddRecipeToCart, RemoveRecipeFromCart, ClearCart} = useContext(CartContext);

    return (
        <input type="checkbox" />
    )
}