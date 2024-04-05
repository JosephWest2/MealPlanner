"use client";

import { createContext, useState, useEffect } from "react";
import type { Recipe, NormalizedUnitType, Cart, CartRecipe } from "@/types";
import { Guid } from "js-guid";

export const CartContext = createContext({cart: null as Cart | null, AddRecipeToCart: null as any, RemoveRecipeFromCart: null as any, ClearCart: null as any, ToggleIngredientInclusion: null as any, OverrideIngredient: null as any, CancelIngredientOverride: null as any});

export default function CartProvider({ children } : any) {

    let cartInit = undefined;
    try {
        if (window) {
            const mtccart = window.localStorage.getItem("mtccart") as string;
            cartInit = JSON.parse(mtccart) as Cart;
        }
    } catch (error) {
        console.log("window null");
    }
    
    const [cart, setCart] = useState(cartInit || {count: 0, recipes: [], ingredients: {}} as Cart);

    useEffect(() => {
        if (window) {
            let cookieString = `mtccart=${JSON.stringify(cart)}; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 *30).toUTCString()}; path=/`;
            document.cookie = cookieString;
            window.localStorage.setItem("mtccart", JSON.stringify(cart));
        }
    }, [cart])

    function NormalizeUnit(amount: number, unit: string) {
        
        const masses = {"g": 1, "mg": 0.001, "lb": 453.592, "oz": 28.3495, "pounds": 453.592, "kg": 1000, "grams": 1, "ounce": 28.3495, "gram": 1, "ounces": 28.3495, "ozs": 28.3495, "gms": 1, "pound": 453.592} as any;
        const volumes = {"ml": 1, "l": 1000, "cup": 236.588, "cups": 236.588, "fl oz": 29.5735, "liters": 1000, "pint": 473.176, "quart": 946.353, "gallon": 3785.41, "milliliters": 1, "deciliters": 100, "deciliter": 100, "quarts": 946.353, "pints": 473.176, "T": 15, "t": 5, "tsps": 5, "C": 240, "tbs": 15, "tbsp": 15, "tbsps": 15, "mls": 1} as any;
        const count = {"": 1}  as any;

        let unitType: NormalizedUnitType;
        let outputAmount: number;
        if (unit in masses) {
            unitType = "g";
            outputAmount = amount * masses[unit];
        } else if (unit in volumes) {
            unitType = "mL"
            outputAmount = amount * volumes[unit];
        } else if (unit in count) {
            unitType = "ct"
            outputAmount = amount;
        } else {
            unitType = "unknown";
            outputAmount = amount;
        }

        return {amount: outputAmount, unitType: unitType}
    }

    function AddRecipeToCart(recipe: Recipe) {
        let _cart = {...cart};
        const guid = Guid.newGuid().toString();
        for (let i = 0; i < recipe.extendedIngredients.length; i++) {
            const ingredient = recipe.extendedIngredients[i];
            if (ingredient.name in _cart.ingredients) {
                const ingredientInCart = _cart.ingredients[ingredient.name];
                const normalized = NormalizeUnit(ingredient.amount, ingredient.unit);
                ingredientInCart.recipeIngredients.push({amount: ingredient.amount, unit: ingredient.unit, recipeGUID: guid, unitType: normalized.unitType, normalizedAmount: normalized.amount});
            } else {
                const normalized = NormalizeUnit(ingredient.amount, ingredient.unit);
                _cart.ingredients[ingredient.name] = {
                    name: ingredient.name,
                    included: true,
                    override: false,
                    overrideValue: null,
                    recipeIngredients: [{amount: ingredient.amount, unit: ingredient.unit, recipeGUID: guid, unitType: normalized.unitType, normalizedAmount: normalized.amount}]};
            }
        }
        const steps = [] as string[];
        for (let i = 0; i < recipe.analyzedInstructions[0].steps.length; i++) {
            steps.push(recipe.analyzedInstructions[0].steps[i].step);
            console.log(recipe.analyzedInstructions[0].steps[i].step);
        }
        _cart.recipes.push({id: recipe.id, name: recipe.title, guid: guid, instructions: steps, imageURL: recipe.image});
        _cart.count++;
        setCart(_cart);
    }

    function RemoveRecipeFromCart(recipe: Recipe | CartRecipe) {
        let _cart = {...cart};
        let guid = null as null | string;
        for (let i = 0; i < cart.recipes.length; i++) {
            if (_cart.recipes[i].id === recipe.id) {
                guid = _cart.recipes[i].guid;
                _cart.recipes.splice(i, 1);
                break;
            }
        }
        if (guid !== null) {
            Object.keys(_cart.ingredients).forEach(key => {
                const ingredient = _cart.ingredients[key];
                let i = 0;
                while (i < ingredient.recipeIngredients.length) {
                    if (ingredient.recipeIngredients[i].recipeGUID === guid) {
                        ingredient.recipeIngredients.splice(i, 1);
                    } else {
                        i++;
                    }
                }
                if (ingredient.recipeIngredients.length === 0) {
                    delete _cart.ingredients[key];
                }
            })
            _cart.count--;
            setCart(_cart);
        }
        
    }

    function ToggleIngredientInclusion(ingredientName: string) {
        let _cart = {...cart};
        if (ingredientName in _cart.ingredients) {
            _cart.ingredients[ingredientName].included = !_cart.ingredients[ingredientName].included;
            setCart(_cart);
        }
    }

    function OverrideIngredient(ingredientName: string, value: string) {
        let _cart = {...cart};
        if (ingredientName in _cart.ingredients) {
            _cart.ingredients[ingredientName].override = true;
            _cart.ingredients[ingredientName].overrideValue = value;
            setCart(_cart);
        }
    }

    function CancelIngredientOverride(ingredientName: string) {
        let _cart = {...cart};
        if (ingredientName in _cart.ingredients) {
            _cart.ingredients[ingredientName].override = false;
            _cart.ingredients[ingredientName].overrideValue = null;
            setCart(_cart);
        }
    }

    function ClearCart() {
        setCart({count: 0, recipes: [], ingredients: {}});
    }

    return (
        <CartContext.Provider value={{cart: cart,
        AddRecipeToCart: AddRecipeToCart,
        RemoveRecipeFromCart: RemoveRecipeFromCart,
        ClearCart: ClearCart,
        ToggleIngredientInclusion: ToggleIngredientInclusion,
        OverrideIngredient: OverrideIngredient,
        CancelIngredientOverride: CancelIngredientOverride}}>
            {children}
        </CartContext.Provider>
    );
}