"use server";

import { cookies } from "next/headers";
import type { Cart } from "@/types";
import { GeneratePDF } from "@/lib/pdfGenerator/pdfGenerator";
import { SendEmail } from "./sendEmail";

export async function SendPDF(emailAddress: string) {

    const cartCookie = cookies().get("mtccart");
    let pdf;
    if (cartCookie && cartCookie.value) {
        const cart = JSON.parse(cartCookie.value) as Cart;
        pdf = await GeneratePDF(cart);
    }

    SendEmail(emailAddress, pdf);
}