"use client";

import { signIn } from "next-auth/react";
import { MySession } from "@/types";
import { useRouter } from "next/router";

export default function ClientRedirect({session}: {session: MySession | undefined}) {

    if (!session || !session.accessToken || session.expiresAt < Date.now()) {
        signIn("kroger", { callbackUrl: "/cart/kroger" });
    } else {
        const router = useRouter();
        router.push("/cart/kroger");
    }

    return <></>

}