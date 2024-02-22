"use client";

import { useState, useEffect } from "react";
import styles from "./cart.module.css";
import cart from "./cart.png";
import Image from "next/image";
import { useCookies } from "react-cookie";

export default function Cart() {

    const [cookies, setCookie] = useCookies(["cart"]);
    const [cartItemCount, setCartItemCount] = useState(0);

    if (cookies.cart === undefined) {
        setCookie("cart", JSON.stringify({count: 0, items: []}), {maxAge: 3600});
    }

    useEffect(() => {
        setCartItemCount(cookies.cart.count);
    }, [cookies])


    return (
        <div className={styles.cart}>
            <Image src={cart} alt="cart"></Image>
            <p>{cartItemCount}</p>
        </div>
    );
}