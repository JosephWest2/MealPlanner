"use client";

import Register from "@/app/actions/register";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import styles from "../auth.module.css";

export default function RegisterPage() {

    const callbackUrl = useSearchParams().get("callbackUrl") || "/";

    async function OnSubmit(formData : FormData) {
        const password = formData.get("password") as string;
        const email = formData.get("email") as string;
        const result = await Register(password, email);
        if (result.success) {
            signIn("credentials", {
                email: email,
                password: password,
                callbackUrl: "/"
            })
        }
        else {
            alert(result.message);
        }
    }

    return (
        <form className={styles.form} action={OnSubmit}>
            <h2 className={styles.header}>Register</h2>
            <label className={styles.label} htmlFor="email">Email</label>
            <input className={styles.input} type="email" name="email" id="email" placeholder="email@example.com" required/>
            <label className={styles.label} htmlFor="password">Password</label>
            <input className={styles.input} type="password" name="password" id="password" required/>
            <input className={styles.submit} type="submit" value="Register"/>
        </form>
    );
}