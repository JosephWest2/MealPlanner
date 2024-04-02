"use client";

import { useContext, useState, useEffect } from "react";
import styles from "./addToCart.module.css";
import { CartContext } from "@/components/client/cartProvider/cartProvider";
import { CartRecipe, Recipe } from "@/types";


export default function AddToCart({recipe}: {recipe: Recipe}) {

    const {cart, AddRecipeToCart, RemoveRecipeFromCart} = useContext(CartContext);

    const [isClient, setIsClient] = useState(false);
    const [showRemoveButton, setShowRemoveButton] = useState(false);
    const [numberInCart, setNumberInCart] = useState(0);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        CheckShowRemoveButton();
    }, [cart]);

    function Add() {
        AddRecipeToCart(recipe);
    }

    function Remove() {
        RemoveRecipeFromCart(recipe);
    }

    function CheckShowRemoveButton() {
        if (!cart) {return;}
        let count = 0;
        cart.recipes.forEach((_recipe: CartRecipe) => {
            console.log(_recipe.id, recipe.id)
            if (recipe.id == _recipe.id) {
                count += 1;
            }
        })
        if (count > 0) {
            setShowRemoveButton(true);
        } else {
            setShowRemoveButton(false);
        }
        setNumberInCart(count);
    }


    return (
        <div className="row">
            <button className={styles.button} onClick={Add}>Add to cart</button>
            {showRemoveButton && isClient ? <button className={styles.button} onClick={Remove}>Remove from cart ({numberInCart})</button> : <></>}
        </div>
        
    )
}