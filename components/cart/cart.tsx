"use client";

import { useState, useEffect, useContext } from "react";
import styles from "./cart.module.css";
import cart from "./cart.png";
import Image from "next/image";
import { CartContext } from "@/components/cartProvider/cartProvider";

export default function Cart() {
    const [cartItemCount, setCartItemCount] = useState(0);

    const {cart, setCart} = useContext(CartContext);

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
        <div className={styles.cart}>
            <Image src={cart} alt="cart"></Image>
            {CartCount()}
        </div>
    );
}