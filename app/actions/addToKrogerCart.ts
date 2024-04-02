"use server";

import type { MySession, Cart } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import jsPDF from "jspdf";
import { cookies } from "next/headers";


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

    const cartCookie = cookies().get("cart");
    let cart;
    if (cartCookie && cartCookie.value) {
        cart = JSON.parse(cartCookie.value) as Cart
    } else {
        cart = undefined;
    }

    if (!cart) {return false;}

    let verticalOffset = 25;
    let horizontalOffset = 25;
    const newLine = 30;
    const large = 30;
    const normal = 20;
    const small = 15;
    var doc = new jsPDF();
    doc.setFontSize(large);
    doc.text("Recipes", horizontalOffset, verticalOffset);
    verticalOffset += newLine;

    for (let i = 0; i < cart.recipes.length; i++) {
        doc.setFontSize(normal);
        doc.text(cart.recipes[i].name, horizontalOffset, verticalOffset);
        verticalOffset += newLine;
        horizontalOffset = 35;
        for (let j = 0; j < cart.recipes[i].instructions.length; j++) {
            doc.setFontSize(small);
            doc.text(j + ". " + cart.recipes[i].instructions[j], horizontalOffset, verticalOffset);
            verticalOffset += newLine;
        }
        horizontalOffset = 25;
    }

    doc.setFontSize(large);
    doc.text("Ingredients", horizontalOffset, verticalOffset);
    verticalOffset += newLine;

    for (const ingredientName in cart.ingredients) {
        const ingredient = cart.ingredients[ingredientName];
        doc.setFontSize(normal);
        doc.text("-" + ingredientName + ": " + Math.round(ingredient.totalAmount) + " " + ingredient.unit, horizontalOffset, verticalOffset);
    }

    doc.save("cart.pdf");

    return response.status === 204;
}