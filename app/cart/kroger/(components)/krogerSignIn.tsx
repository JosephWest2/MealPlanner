"use client";

import { useRouter } from "next/navigation";

export default function KrogerSignIn({clientId} : {clientId: string}) {

    const router = useRouter();

    function OnClick() {
        const scope = "profile.compact+product.compact+cart.basic:write";
        let redirectUri = "https://meal2cart.com/auth/kroger/authorize";
        if (process.env.NODE_ENV === "development") {
            redirectUri = "http://localhost:3000/auth/kroger/authorize";
        }
        router.push(`https://api.kroger.com/v1/connect/oauth2/authorize?scope=${scope}&response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`);
    }

    return <button onClick={OnClick}>Sign in with Kroger</button>
}
