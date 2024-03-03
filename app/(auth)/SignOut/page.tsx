"use client";

import { signOut } from "next-auth/react";
import styles from "../auth.module.css";

export default function SignOut() {

    function OnSubmit(formData : FormData) {
        signOut({ callbackUrl: "/"});
    }

    return (
        <form className={styles.form} action={OnSubmit}>
            <h2 className={styles.header}>Sign out</h2>
            <p>Are you sure you want to sign out?</p>
            <input className={styles.submit} type="submit" value="Sign out"/>
        </form>
    );
}