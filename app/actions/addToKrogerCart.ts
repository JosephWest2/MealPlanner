"use server";

import type { Cart, KrogerJWT } from "@/types";
import { redirect } from "next/navigation";
import { GeneratePDF } from "@/lib/pdfGenerator/pdfGenerator";
import { SendEmail } from "./sendEmail";

export default async function AddToKrogerCart(
    productIds: string[],
    downloadPDF: boolean,
    cart: Cart,
    session: KrogerJWT,
    emailAddress?: string
) {

    if (!session.payload || !session.payload.krogerAccessToken || !session.payload.krogerId) {
        return {success: false, pdf: null}
    }
    const productArray = [];
    for (let i = 0; i < productIds.length; i++) {
        const productId = productIds[i];
        if (productId !== "") {
            productArray.push({ quantity: 1, upc: productId });
        }
    }

    const response = await fetch("https://api.kroger.com/v1/cart/add", {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + session.payload.krogerAccessToken,
        },
        body: JSON.stringify({ items: productArray }),
    });

    if (response.status == 401) {
        redirect("/auth/kroger/signin");
    }

    let pdf;
    if (downloadPDF) {
        pdf = await GeneratePDF(cart);
    }
    if (emailAddress) {
        SendEmail(emailAddress, pdf);
    }

    return { success: response.status === 204, pdf: pdf };
}
