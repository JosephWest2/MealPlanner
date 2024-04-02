"use server";

import type { MySession } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AddToKrogerCart(productIds: string[]) {
    const session = await getServerSession(authOptions) as MySession;
    if (!session?.accessToken) {
        redirect("/auth/kroger/signin");
    }

    const productArray = productIds.map(productId => {
        return {quantity: 1, upc: productId};
    })

    const response = await fetch("https://api.kroger.com/v1/cart/add", {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + session.accessToken
        },
        body: JSON.stringify({items: productArray})
    })

    if (response.status == 401) {
        redirect("/auth/kroger/signin");
    }

    return response.status === 204;
}