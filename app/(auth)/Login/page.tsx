"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import styles from "../auth.module.css";

export default function Login() {

    const callbackUrl = useSearchParams().get("callbackUrl") || "/";

    function OnSubmit(formData : FormData) {
        signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            callbackUrl: callbackUrl
        })
    }

    return (
        <form className={styles.form} action={OnSubmit}>
            <h2 className={styles.header}>Login</h2>
            <label className={styles.label} htmlFor="email">Email</label>
            <input className={styles.input} type="email" name="email" id="email" placeholder="email@example.com" />
            <label className={styles.label} htmlFor="password">Password</label>
            <input className={styles.input} type="password" name="password" id="password" />
            <input className={styles.submit} type="submit" value="Login"/>
        </form>
    );
}