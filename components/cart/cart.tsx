"use client";

import { useState, useEffect, useContext } from "react";
import styles from "./cart.module.css";
import cartImage from "./cart.png";
import Image from "next/image";
import Link from "next/link";
import { CartContext } from "@/components/cartProvider/cartProvider";

export default function Cart() {
    const [cartItemCount, setCartItemCount] = useState(0);

    const {cart, AddRecipeToCart} = useContext(CartContext);

    useEffect(() => {
        if (cart && cart.count) {
            setCartItemCount(cart.count);
        }
    }, [cart])

    function CartCount() {
        if (!cart || !cart.count) {
            return <></>
        }
        return <p>{cartItemCount}</p>
    }

    return (
        <>
        <Link href="/Cart">
            <div className={styles.cart}>
                <Image src={cartImage} alt="cart"></Image>
                {CartCount()}
            </div>
        </Link>
        </>
        
    );
}