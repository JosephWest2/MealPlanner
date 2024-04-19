"use client";

import { useRouter } from "next/navigation";

export default function KrogerSignIn({clientId} : {clientId: string}) {

    const router = useRouter();

    function OnClick() {
        router.push(``)
    }

    return <button onClick={OnClick}>Sign in with Kroger</button>
}
