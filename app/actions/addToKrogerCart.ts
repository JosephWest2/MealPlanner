"use server";

import type { MySession, Cart } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { GeneratePDF } from "@/lib/pdfGenerator/pdfGenerator";
import { SendEmail } from "./sendEmail";

export default async function AddToKrogerCart(productIds: string[], downloadPDF: boolean, emailAddress?: string) {
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

    const cartCookie = cookies().get("mtccart");
    let pdf;
    if (downloadPDF && cartCookie && cartCookie.value) {
        const cart = JSON.parse(cartCookie.value) as Cart;
        pdf = await GeneratePDF(cart);
    }
    if (emailAddress) {
        SendEmail(emailAddress, pdf);
    }

    return {success: response.status === 204, pdf: pdf};
}