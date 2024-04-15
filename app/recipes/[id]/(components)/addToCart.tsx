"use client";

import { useContext, useState, useEffect } from "react";
import styles from "./addToCart.module.css";
import { CartContext } from "@/sharedComponents/cartProvider/cartProvider"
import { Recipe } from "@/types";

export default function AddToCart({ recipe }: { recipe: Recipe }) {
    const { cart, AddRecipeToCart, RemoveRecipeFromCart } =
        useContext(CartContext);

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
        AddRecipeToCart && AddRecipeToCart(recipe);
    }

    function Remove() {
        RemoveRecipeFromCart && RemoveRecipeFromCart(recipe.id.toString());
    }

    function CheckShowRemoveButton() {
        if (!cart) {
            return;
        }
        let count = 0;
        const _id = recipe.id.toString();
        if (_id in cart.recipes) {
            count = cart.recipes[_id].count;
        }
        if (count > 0) {
            setShowRemoveButton(true);
        } else {
            setShowRemoveButton(false);
        }
        setNumberInCart(count);
    }

    return (
        <div className="row">
            <button className={styles.button} onClick={Add}>
                Add to cart
            </button>
            {showRemoveButton && isClient ? (
                <button className={styles.button} onClick={Remove}>
                    Remove from cart ({numberInCart})
                </button>
            ) : (
                <></>
            )}
        </div>
    );
}
