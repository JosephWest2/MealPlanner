"use client"

import Link from "next/link";
import NavCart from "../navCart/navCart";
import styles from "./navbar.module.css";
import { useState, useEffect } from "react";

export default function Navbar() {

    const [visible, setVisible] = useState<"true" | "false">("true");
    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    if (!isClient) {
        return null;
    }

    let prevY = window.scrollY;

    window.onscroll = () => {
        if (window.scrollY > prevY) {
            setVisible("false");
        } else {
            setVisible("true");
        }

        prevY = window.scrollY;
    }
    return (
        <nav className={styles.nav} data-visible={visible}>
            <Link className={styles.navBox} href="/">Recipes</Link>
            <NavCart className={styles.navBox}></NavCart>
        </nav>
    )
}