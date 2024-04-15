"use server";

import { GeneratePDF } from "@/lib/pdfGenerator/pdfGenerator";
import { Cart } from "@/types";

export async function GetPDF(cart: Cart) {
    return GeneratePDF(cart);
}
