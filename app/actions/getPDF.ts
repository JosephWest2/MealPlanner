"use server";

import { cookies } from "next/headers";
import type { Cart } from "@/types";
import { GeneratePDF } from "@/lib/pdfGenerator/pdfGenerator";

export async function GetPDF() {

    const cartCookie = cookies().get("mtccart");
    let cart;

    if (!cartCookie || !cartCookie.value) {
        return null;
    }
    cart = JSON.parse(cartCookie.value) as Cart;
    return GeneratePDF(cart);
}