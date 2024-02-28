"use client";

import { CartContext } from "@/components/cartProvider/cartProvider";
import { useContext, useState, useEffect } from "react";
import type { cart, cartIngredient } from "@/components/cartProvider/cartProvider";


const masses = {"g": 1, "mg": 0.001, "lb": 453.592, "oz": 28.3495, "pounds": 453.592, "kg": 1000, "grams": 1, "ounce": 28.3495, "gram": 1, "ounces": 28.3495, "ozs": 28.3495, "gms": 1, "pound": 453.592} as any;
const volumes = {"ml": 1, "l": 1000, "cup": 236.588, "cups": 236.588, "fl oz": 29.5735, "liters": 1000, "pint": 473.176, "quart": 946.353, "gallon": 3785.41, "milliliters": 1, "deciliters": 100, "deciliter": 100, "quarts": 946.353, "pints": 473.176, "drops": 0.05, "T": 15, "t": 5, "tsps": 5, "C": 240, "tbs": 15, "tbsp": 15, "tbsps": 15, "mls": 1} as any;
const quantities = {"": 1, "piece": 0.5, "slice": 0.5, "ball": 1, "roll": 1, "servings": 1, "bunch": 1, "handful": 1, "scoop": 1, "strip": 1, "rib": 1, "stalk": 1, "head": 1, "small piece": 1, "handfuls": 1, "large cloves": 1, "loaf": 1, "stick": 1, "sheets": 1, "halves": 0.5, "glass": 1} as any;
const pack = {"pack": 1, "bottle": 1, "can": 1, "package": 1, "cans": 1, "packet": 1, "jar": 1, "container": 1, "packets": 1, "box": 1, "pouch": 1, "pkg": 1,  "envelope": 1, "bag": 1} as any;
type NormalizedUnitType = "g" | "mL" | "count" | "pack" | undefined

function NormalizeUnit(amount: number, unit: string) {

    let unitType: NormalizedUnitType = undefined;
    let outputAmount: number;
    if (unit in masses) {
        unitType = "g";
        outputAmount = amount * masses[unit];
    } else if (unit in volumes) {
        unitType = "mL"
        outputAmount = amount * volumes[unit];
    } else if (unit in quantities) {
        unitType = "count"
        outputAmount = amount * quantities[unit];
    } else if (unit in pack) {
        unitType = "pack"
        outputAmount = amount * pack[unit];
    } else {
        outputAmount = amount;
    }

    return {amount: outputAmount, unitType: unitType}
}

export default function Cart() {

    const {cart, ToggleIngredientInclusion, RemoveRecipeFromCart} = useContext(CartContext);

    const [ingredients, setIngredients] = useState({} as any);

    useEffect(() => {
        if (!cart) return;
        let _ingredients = {} as any;
        for (let i = 0; i < cart.ingredients.length; i++) {
            const ingredient = cart.ingredients[i];
            const normalized = NormalizeUnit(ingredient.amount, ingredient.unit);
            if (ingredient.name in _ingredients) {
                _ingredients[ingredient.name].amount += normalized.amount;
            } else {
                _ingredients[ingredient.name] = {amount: normalized.amount, unitType: normalized.unitType, included: ingredient.included};
            }

        }
        setIngredients(_ingredients);
    }, [cart])

    if (!cart || !cart.count) {
        return <p>Cart is empty</p>
    }

    return (<>
        <h2>Recipes</h2>
        <ul>
            {cart.recipes.map((recipe, _key: number) => (
                <li key={_key}>{recipe.name} <button onClick={() => RemoveRecipeFromCart(recipe)}>Remove</button></li>
            ))}
        </ul>
        <h2>Ingredients</h2>
        <ol>
            {cart.ingredients.map((ingredient, _key: number) => (
                <li key={_key}>{ingredient.name} {ingredient.amount} {ingredient.unit} <input type="checkbox" onClick={() => ToggleIngredientInclusion(ingredient)} checked={ingredient.included}/></li>
            ))}
        </ol>
        <ol>
            {Object.keys(ingredients).map((ingredient, _key: number) => (
                <li key={_key}>{ingredient} {ingredients[ingredient].amount} {ingredients[ingredient].unitType}</li>
            ))}
        </ol>
    </>)

}