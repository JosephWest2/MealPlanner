"use server";

import type { Cart } from "@/types";
import { GeneratePDF } from "@/lib/pdfGenerator/pdfGenerator";
import { SendEmail } from "./sendEmail";

export async function SendPDF(emailAddress: string, cart : Cart) {

    const pdf = await GeneratePDF(cart);
    SendEmail(emailAddress, pdf);
}
