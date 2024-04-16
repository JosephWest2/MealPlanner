"use client";

import { MySession } from "@/types";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


export default function KrogerSignIn() {
    const {data: session} = useSession();
    const router = useRouter()
    const _session = session as MySession | undefined;

    function OnClick() {
        if (_session && _session.user && _session.expiresAt > Date.now()) {
            router.push("/cart/kroger");
        } else {
            signIn("kroger", {redirectUrl: "/cart/kroger"})
        }
    }


    return <button onClick={OnClick}>Sign in with Kroger</button>
}