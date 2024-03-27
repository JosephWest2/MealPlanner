"use client";

import styles from "./navCart.module.css";
import cartImage from "./navcart.png";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "@/components/client/cartProvider/cartProvider";
import { useState, useEffect } from "react";

export default function NavCart({className} : {className: string}) {

    const {cart} = useContext(CartContext);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <Link className={className} href="/cart">
            <div className={styles.cart}>
                <Image src={cartImage} alt="cart"></Image>
                <p>{isClient && cart ? cart.count : 0}</p>
            </div>
        </Link>
    );
}