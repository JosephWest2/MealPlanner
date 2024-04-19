import type { CookieIngredients, KrogerJWT } from "@/types";
import { cookies } from "next/headers";
import Link from "next/link";
import Location from "./(components)/location";
import KrogerIngredients from "./(components)/krogerIngredients";
import { Suspense } from "react";
import KrogerSignIn from "./(components)/krogerSignIn";
import { ReadJWT } from "@/app/actions/jwt";

export default async function KrogerCart({
    searchParams,
}: {
    searchParams: {
        storeId: string | undefined;
        ais: boolean | undefined;
        dth: boolean | undefined;
        csp: boolean | undefined;
    };
}) {
    
    const signin = (
        <div className="box column" style={{ marginTop: "2rem" }}>
            <KrogerSignIn
                clientId={process.env.KROGER_CLIENT_ID!}
            ></KrogerSignIn>
        </div>
    );

    const sessionCookie = cookies().get("session");
    if (!sessionCookie || !sessionCookie.value) {
        return signin;
    }

    let jwt = await ReadJWT(sessionCookie.value);
    if (!jwt || !jwt.payload.krogerId || jwt.payload.exp < Date.now()) {
        return signin;
    }

    const cookieIngredientsCookie = cookies().get("mtcingredients");

    let cookieIngredients;
    if (cookieIngredientsCookie && cookieIngredientsCookie.value) {
        cookieIngredients = JSON.parse(
            cookieIngredientsCookie.value
        ) as CookieIngredients;
    } else {
        cookieIngredients = undefined;
    }

    if (!cookieIngredients) {
        return (
            <div className="box column">
                <h3>Cart is empty</h3>
                <Link href="/">Return to recipes</Link>
            </div>
        );
    }

    const filters = [] as string[];
    if (searchParams.ais) {
        filters.push("ais");
    }
    if (searchParams.dth) {
        filters.push("dth");
    }
    if (searchParams.csp) {
        filters.push("csp");
    }

    return (
        <div className="column">
            <Suspense fallback={<div className="box">Loading Location...</div>}>
                <Location></Location>
            </Suspense>
            <KrogerIngredients
                storeId={searchParams.storeId}
                filters={filters}
                session={jwt as KrogerJWT}
            ></KrogerIngredients>
        </div>
    );
}
