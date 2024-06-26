import type { Cart } from "@/types";
import { jsPDF } from "jspdf";
import "./Inter-bold";
import "./Inter-normal";

export async function GeneratePDF(cart: Cart) {
    if (!cart) {
        return;
    }
    let verticalOffset = 20;
    let horizontalOffset = 20;
    const newLine = 8;
    const large = 20;
    const medium = 15;
    const small = 10;
    let doc = new jsPDF();

    function NewPageCheck() {
        if (verticalOffset > 280) {
            NewPage();
        }
    }

    function NewPage() {
        doc.addPage();
        verticalOffset = 20;
        horizontalOffset = 20;
    }

    function h1() {
        horizontalOffset = 20;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(large);
        doc.setFont("Inter", "bold");
    }
    function h2() {
        horizontalOffset = 30;
        doc.setTextColor(0, 0, 0);
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
        doc.setDrawColor(0, 0, 0);
        doc.line(
            horizontalOffset,
            verticalOffset + 1.5,
            horizontalOffset + textWidth,
            verticalOffset + 1.5
        );
    }

    function AddText(text: string) {
        let array = [];
        while (text.length > 90) {
            let i = 90;
            while (i > 0) {
                if (text[i] === " ") {
                    array.push(text.substring(0, i));
                    text = text.substring(i);
                    break;
                }
                i--;
            }
            if ( i == 0) {
                break;
            }
        }
        array.push(text);
        for (let i = 0; i < array.length; i++) {
            doc.text(array[i], horizontalOffset, verticalOffset);
            verticalOffset += 0.5 * newLine;
        }
    }

    function AddTextHalfPage(text: string) {
        let array = [];
        while (text.length > 40) {
            let i = 40;
            while (i > 0) {
                if (text[i] === " ") {
                    array.push(text.substring(0, i));
                    text = text.substring(i);
                    break;
                }
                i--;
            }
            if ( i == 0) {
                break;
            }
        }
        array.push(text);
        for (let i = 0; i < array.length; i++) {
            doc.text(array[i], horizontalOffset, verticalOffset);
            verticalOffset += 0.5 * newLine;
        }
    }

    let count = 0;
    for (const id in cart.recipes) {
        if (count > 0) {
            NewPage();
        }
        const recipe = cart.recipes[id].recipe;
        h1();
        NewPageCheck();
        doc.text(recipe.name, horizontalOffset, verticalOffset);
        verticalOffset += 1.25 * newLine;

        h2();
        NewPageCheck();
        doc.text("Ingredients", horizontalOffset, verticalOffset);
        Underline("Ingredients");
        verticalOffset += newLine;
        try {
            const imageResponse = await fetch(recipe.imageURL);
            const buffer = await imageResponse.arrayBuffer();
            const imageURL = Buffer.from(buffer).toString("base64");
            doc.addImage(imageURL, "JPEG", 110, verticalOffset - 5, 80, 50);
        } catch (e) {
            console.log(e);
        }
        let accumulation = 0;
        recipe.originalIngredients.forEach(oi => {
            p();
            AddTextHalfPage("• " + oi);
            verticalOffset += 0.5 * newLine;
            accumulation += newLine;
            NewPageCheck();
        })

        h2();
        NewPageCheck();
        if (accumulation < 40) {
            verticalOffset += 30;
        }
        verticalOffset += 0.5 * newLine;
        doc.text("Directions", horizontalOffset, verticalOffset);
        Underline("Directions");
        verticalOffset += newLine;

        for (let j = 0; j < recipe.instructions.length; j++) {
            p();
            AddText(j + 1 + ". " + recipe.instructions[j]);
            verticalOffset += 0.5 * newLine;
            NewPageCheck();
        }

        h2();
        NewPageCheck();
        if (accumulation < 40) {
            verticalOffset += 30;
        }
        verticalOffset += 0.5 * newLine;
        doc.text("Nutrition", horizontalOffset, verticalOffset);
        Underline("Nutrition");
        verticalOffset += newLine;

        let nutritionString =
            " Serving Size: " +
            recipe.nutrition.weightPerServing.amount +
            " " +
            recipe.nutrition.weightPerServing.unit +
            ", ";
        for (let j = 0; j < recipe.nutrition.nutrients.length; j++) {
            const nutrient = recipe.nutrition.nutrients[j];
            nutritionString +=
                nutrient.name +
                " " +
                nutrient.amount +
                " " +
                nutrient.unit +
                ", ";
        }
        p();
        AddText(nutritionString);
        verticalOffset += 0.5 * newLine;
        count ++;
    }

    h1();
    NewPage();
    verticalOffset += newLine;
    doc.text("Shopping List", horizontalOffset, verticalOffset);
    verticalOffset += 1.25 * newLine;

    for (const ingredientName in cart.ingredients) {
        p();
        horizontalOffset = 30;
        const ingredient = cart.ingredients[ingredientName];
        if (!ingredient.included) {
            continue;
        }

        const _ingredients = {} as { [unit: string]: number };
        cart.ingredients[ingredientName].recipeIngredients.forEach((ri) => {
            if (ri.unit in _ingredients) {
                _ingredients[ri.unit] += ri.amount;
            } else {
                _ingredients[ri.unit] = ri.amount;
            }
        });

        let amountsAndUnits = "";
        for (const unit in _ingredients) {
            if (amountsAndUnits === "") {
                amountsAndUnits += Math.round(_ingredients[unit]) + " " + unit;
            } else {
                amountsAndUnits +=
                    ", " + Math.round(_ingredients[unit]) + " " + unit;
            }
        }
        doc.text(
            "• " + ingredientName + ": " + amountsAndUnits,
            horizontalOffset,
            verticalOffset
        );
        verticalOffset += newLine;
        NewPageCheck();
    }

    return doc.output("dataurlstring", { filename: "M2COrder" });
}
