"use client";

import { useCookies } from "react-cookie";
import { useContext } from "react";
import styles from "./addToCart.module.css";
import { CartContext } from "@/components/cartProvider/cartProvider";


export default function AddToCart({recipe}: {recipe: any}) {

    const {cart, setCart} = useContext(CartContext);
    function OnClick() {

        if (cart === undefined) {
            setCart({count: 1, recipeIds: [recipe.id]})
            return;
        }
    
        setCart({count: cart.count + 1, recipeIds: [...cart.recipeIds, recipe.id]});
    }

    return (
        <button className={styles.addToCart} onClick={OnClick}>Add to cart</button>
    )
}