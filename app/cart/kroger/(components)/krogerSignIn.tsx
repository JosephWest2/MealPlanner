"use client";

import { signIn } from "next-auth/react";

export default function KrogerSignIn() {

    function OnClick() {
        signIn("kroger", {redirectUrl: "/cart/kroger"})
    }

    return <button onClick={OnClick}>Sign in with Kroger</button>
}