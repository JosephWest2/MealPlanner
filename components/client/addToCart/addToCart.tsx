"use client";

import { useContext } from "react";
import styles from "./addToCart.module.css";
import { CartContext } from "@/components/client/cartProvider/cartProvider";


export default function AddToCart({recipe}: {recipe: any}) {

    const {AddRecipeToCart} = useContext(CartContext);
    function OnClick() {
        AddRecipeToCart(recipe);
    }

    return (
        <button className={styles.addToCart} onClick={OnClick}>Add to cart</button>
    )
}