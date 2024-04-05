import type { Cart } from "@/types";
import { jsPDF } from "jspdf";
import "./Inter-bold";
import "./Inter-normal";

export async function GeneratePDF(cart: Cart) {

    if (!cart) {return}
    let verticalOffset = 20;
    let horizontalOffset = 20;
    const newLine = 8;
    const large = 20;
    const medium = 15;
    const small = 10;
    let doc = new jsPDF();


    function NewPageCheck() {
        if (verticalOffset > 280) {
            doc.addPage();
            verticalOffset = 20;
            horizontalOffset = 20;
        }
    }

    function h1() {
        horizontalOffset = 20;
        doc.setTextColor(0,0,0);
        doc.setFontSize(large);
        doc.setFont("Inter", "bold");
    }
    function h2() {
        horizontalOffset = 30;
        doc.setTextColor(0,0,0);
        doc.setFontSize(medium);
        doc.setFont("Inter", "normal");
    }
    function p() {
        horizontalOffset = 30;
        doc.setFontSize(small);
        doc.setFont("Inter", "normal");
    }
    function Underline(text: string) {
        const textWidth = doc.getTextWidth(text);
        doc.setDrawColor(0,0,0);
        doc.line(horizontalOffset, verticalOffset + 1.5, horizontalOffset + textWidth, verticalOffset + 1.5);
    }

    function AddText(text: string) {
        let array = [];
        while (text.length > 0) {
            let i = 90;
            if (i >= text.length) {
                array.push(text);
                break;
            }
            while (i < text.length) {
                if (text[i] === " ") {
                    array.push(text.substring(0, i));
                    text = text.substring(i);
                    break;
                }
                i++;
            }
        }
        for (let i = 0; i < array.length; i++) {
            doc.text(array[i], horizontalOffset, verticalOffset);
            verticalOffset += 0.5*newLine;
        }
    }

    for (let i = 0; i < cart.recipes.length; i++) {

        h1();
        NewPageCheck();
        doc.text(cart.recipes[i].name, horizontalOffset, verticalOffset);
        verticalOffset += 1.25*newLine;

        h2();
        NewPageCheck();
        doc.text("Ingredients", horizontalOffset, verticalOffset);
        Underline("Ingredients");
        verticalOffset += newLine;
        try {
            const imageResponse = await fetch(cart.recipes[i].imageURL);
            const buffer = await imageResponse.arrayBuffer();
            const imageURL = Buffer.from(buffer).toString('base64');
            doc.addImage(imageURL, "JPEG", 110, verticalOffset - 5, 80, 50);
        } catch (e) {
            console.log(e);
        }
        let accumulation = 0;
        for (const ingredientName in cart.ingredients) {
            let ing = cart.ingredients[ingredientName].recipeIngredients.find(ri => ri.recipeGUID === cart.recipes[i].guid);
            if (!ing) {continue}
            p();
            doc.text("• " + ingredientName + ": " + Math.round(ing.amount) + " " + ing.unit, horizontalOffset, verticalOffset);
            verticalOffset += newLine;
            accumulation += newLine;
            NewPageCheck();
        }

        h2();
        NewPageCheck();
        if (accumulation < 40) {
            verticalOffset += 30;
        }
        verticalOffset += 0.5*newLine;
        doc.text("Directions", horizontalOffset, verticalOffset);
        Underline("Directions");
        verticalOffset += newLine;
        
        for (let j = 0; j < cart.recipes[i].instructions.length; j++) {
            p();
            AddText(j+1 + ". " + cart.recipes[i].instructions[j]);
            verticalOffset += 0.5*newLine;
            NewPageCheck();
        }
        
    }

    h1();
    NewPageCheck();
    verticalOffset += newLine;
    doc.text("Shopping List", horizontalOffset, verticalOffset);
    verticalOffset += 1.25*newLine;

    for (const ingredientName in cart.ingredients) {
        p();
        horizontalOffset = 30;
        const ingredient = cart.ingredients[ingredientName];
        if (!ingredient.included) {
            continue;
        }
        let amountsAndUnits = "";
        for (let i = 0; i < ingredient.recipeIngredients.length; i++) {
            const ri = ingredient.recipeIngredients[i];
            if (i === 0) {
                amountsAndUnits += Math.round(ri.amount) + " " + ri.unit;
            } else {
                amountsAndUnits += " +" + Math.round(ri.amount) + " " + ri.unit;
            }
        }
        doc.text("• " + ingredientName + ": " + amountsAndUnits, horizontalOffset, verticalOffset);
        verticalOffset += newLine;
        NewPageCheck();
    }

    return doc.output("dataurlstring", {filename: "MTCOrder"});
}