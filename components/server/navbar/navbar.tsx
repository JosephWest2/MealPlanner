import Link from "next/link";
import NavCart from "@/components/client/navCart/navCart";
import styles from "./navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link className={styles.navBox} href="/">Recipes</Link>
            <NavCart className={styles.navBox}></NavCart>
        </nav>
    )
}