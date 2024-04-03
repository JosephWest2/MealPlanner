import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { MySession, Cart } from "@/types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import Location from "./(client)/location";
import Ingredients from "./(server)/ingredients";
import { Suspense } from "react";

export default async function KrogerCart({searchParams}: {searchParams: {storeId: string | undefined, ais: boolean | undefined, dth: boolean | undefined, csp: boolean | undefined}}) {

    const cartCookie = cookies().get("mtccart");

    let cart;
    if (cartCookie && cartCookie.value) {
        cart = JSON.parse(cartCookie.value) as Cart
    } else {
        cart = undefined;
    }

    const session = await getServerSession(authOptions) as MySession;
    if (!session || !session.accessToken || session.expiresAt < Date.now()) {
        redirect("/auth/kroger/signin");
    }

    if (!cart) {
        return <div className="box column">
            <h3>Cart is empty</h3>
            <Link href="/">Return to recipes</Link>
        </div>
    }

    const filters = [] as string[];
    if (searchParams.ais) {
        filters.push("ais")
    }
    if (searchParams.dth) {
        filters.push("dth")
    }
    if (searchParams.csp) {
        filters.push("csp")
    }

    return (<div className="column">
        <Suspense fallback={<div className="box">Loading Location...</div>}>
            <Location></Location>
        </Suspense>   
        <Ingredients storeId={searchParams.storeId} filters={filters} session={session}></Ingredients>
    </div>
        
    )
}