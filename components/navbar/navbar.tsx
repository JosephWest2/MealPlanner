import Link from "next/link";
import { Session } from "next-auth";
import NavCart from "@/components/navCart/navCart";
import styles from "./navbar.module.css";

export default function Navbar({session} : {session: Session | null}) {

    let account;
    if (session && session.user) {
        account = <>
            <Link className={styles.navBox} href="/account">Account</Link>
        </>
    } else {
        account = <Link className={styles.navBox} href="/api/auth/signin">Sign In</Link>
    }

    return (
        <nav className={styles.nav}>
            <Link className={styles.navBox} href="/">Recipes</Link>
            {account}
            <NavCart className={styles.navBox}></NavCart>
        </nav>
    )
}