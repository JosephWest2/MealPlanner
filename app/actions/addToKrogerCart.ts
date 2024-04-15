"use server";

import type { MySession, Cart } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import { GeneratePDF } from "@/lib/pdfGenerator/pdfGenerator";
import { SendEmail } from "./sendEmail";

export default async function AddToKrogerCart(
    productIds: string[],
    downloadPDF: boolean,
    cart: Cart,
    emailAddress?: string
) {
    const session = (await getServerSession(authOptions)) as MySession;
    if (!session?.accessToken) {
        redirect("/auth/kroger/signin");
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
            Authorization: "Bearer " + session.accessToken,
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
