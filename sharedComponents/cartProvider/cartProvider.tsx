"use client";

import { createContext, useState, useEffect } from "react";
import type {
    Recipe,
    NormalizedUnitType,
    Cart,
    CookieIngredients,
} from "@/types";

export const CartContext = createContext({
    cart: null as Cart | null,
    AddRecipeToCart: null as null | ((r: Recipe) => void),
    RemoveRecipeFromCart: null as null | ((recipeId: string) => void),
    ClearCart: null as null | (() => void),
    ToggleIngredientInclusion: null as
        | null
        | ((ingredientName: string) => void),
    OverrideIngredient: null as
        | null
        | ((ingrdientName: string, overrideValue: string) => void),
    CancelIngredientOverride: null as null | ((ingredientName: string) => void),
});

export default function CartProvider({ children }: any) {
    const [cart, setCart] = useState(CartInit());

    function CartInit() {
        if (typeof window === "undefined") {
            return { count: 0, recipes: {}, ingredients: {} } as Cart;
        }
        let cartInit = undefined;
        const mtccart = window.localStorage.getItem("mtccart") as string;
        cartInit = JSON.parse(mtccart) as Cart;
        if (cartInit) {
            return cartInit;
        } else {
            return { count: 0, recipes: {}, ingredients: {} } as Cart;
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cookieIngredients = {} as CookieIngredients;
            Object.keys(cart.ingredients).forEach((ingredientName) => {
                const ingredient = cart.ingredients[ingredientName];
                const ci = { units: {} } as {
                    units: { [unit: string]: number };
                    included: boolean;
                    override: string | null;
                };
                ingredient.recipeIngredients.forEach((recipeIngredient) => {
                    if (ci.units[recipeIngredient.unit]) {
                        ci.units[recipeIngredient.unit] +=
                            recipeIngredient.amount;
                    } else {
                        ci.units[recipeIngredient.unit] =
                            recipeIngredient.amount;
                    }
                });
                ci.included = ingredient.included;
                ingredient.override && ingredient.overrideValue !== null
                    ? (ci.override = ingredient.overrideValue)
                    : (ci.override = null);
                cookieIngredients[ingredientName] = ci;
            });
            let cookieString = `mtcingredients=${JSON.stringify(
                cookieIngredients
            )}; expires=${new Date(
                Date.now() + 1000 * 60 * 60 * 24 * 30
            ).toUTCString()}; path=/;`;
            document.cookie = cookieString;
            window.localStorage.setItem("mtccart", JSON.stringify(cart));
        }
    }, [cart]);

    function NormalizeUnit(amount: number, unit: string) {
        const masses = {
            g: 1,
            mg: 0.001,
            lb: 453.592,
            oz: 28.3495,
            pounds: 453.592,
            kg: 1000,
            grams: 1,
            ounce: 28.3495,
            gram: 1,
            ounces: 28.3495,
            ozs: 28.3495,
            gms: 1,
            pound: 453.592,
        } as any;
        const volumes = {
            ml: 1,
            l: 1000,
            cup: 236.588,
            cups: 236.588,
            "fl oz": 29.5735,
            liters: 1000,
            pint: 473.176,
            quart: 946.353,
            gallon: 3785.41,
            milliliters: 1,
            deciliters: 100,
            deciliter: 100,
            quarts: 946.353,
            pints: 473.176,
            T: 15,
            t: 5,
            tsps: 5,
            C: 240,
            tbs: 15,
            tbsp: 15,
            tbsps: 15,
            mls: 1,
        } as any;
        const count = { "": 1 } as any;

        let unitType: NormalizedUnitType;
        let outputAmount: number;
        if (unit in masses) {
            unitType = "g";
            outputAmount = amount * masses[unit];
        } else if (unit in volumes) {
            unitType = "mL";
            outputAmount = amount * volumes[unit];
        } else if (unit in count) {
            unitType = "ct";
            outputAmount = amount;
        } else {
            unitType = "unknown";
            outputAmount = amount;
        }

        return { amount: outputAmount, unitType: unitType };
    }

    function AddRecipeToCart(recipe: Recipe) {
        let _cart = { ...cart };
        for (let i = 0; i < recipe.extendedIngredients.length; i++) {
            const ingredient = recipe.extendedIngredients[i];
            const levenshtein = require('js-levenshtein');
            const distanceNormalized = (ingredient.name.length - levenshtein(ingredient.name, ingredient.nameClean)) / ingredient.name.length;
            let usedName;
            if (distanceNormalized < 0.5) {
                usedName = ingredient.name;
            } else {
                usedName = ingredient.nameClean;
            }
            if (usedName in _cart.ingredients) {
                const ingredientInCart =
                    _cart.ingredients[usedName];
                ingredientInCart.recipeIngredients.push({
                    amount: ingredient.amount,
                    unit: ingredient.unit,
                    recipeId: recipe.id.toString(),
                });
            } else {
                _cart.ingredients[usedName] = {
                    included: true,
                    override: false,
                    overrideValue: null,
                    recipeIngredients: [
                        {
                            amount: ingredient.amount,
                            unit: ingredient.unit,
                            recipeId: recipe.id.toString(),
                        },
                    ],
                };
            }
        }
        const steps = [] as string[];
        for (let i = 0; i < recipe.analyzedInstructions[0].steps.length; i++) {
            steps.push(recipe.analyzedInstructions[0].steps[i].step);
        }
        const _id = recipe.id.toString();
        if (_id in _cart.recipes) {
            _cart.recipes[_id].count++;
        } else {
            _cart.recipes[_id] = {
                count: 1,
                recipe: {
                    name: recipe.title,
                    imageURL: recipe.image,
                    instructions: steps,
                    nutrition: recipe.nutrition,
                    originalIngredients: recipe.extendedIngredients.map(
                        (ei) => {
                            return ei.original;
                        }
                    ),
                },
            };
        }
        _cart.count++;
        setCart(_cart);
    }

    function RemoveRecipeFromCart(recipeId: string) {
        let _cart = { ...cart };
        const cartRecipe = _cart.recipes[recipeId];
        if (!(recipeId in _cart.recipes)) {
            return;
        }
        cartRecipe.count--;
        _cart.count--;
        Object.keys(_cart.ingredients).forEach((ingredientName) => {
            const ingredient = _cart.ingredients[ingredientName];
            let i = 0;
            while (i < ingredient.recipeIngredients.length) {
                const recipeIngredient = ingredient.recipeIngredients[i];
                if (recipeIngredient.recipeId === recipeId) {
                    ingredient.recipeIngredients.splice(i, 1);
                    break;
                }
                i++;
            }
            if (ingredient.recipeIngredients.length === 0) {
                delete _cart.ingredients[ingredientName];
            }
        });
        if (_cart.recipes[recipeId].count <= 0) {
            delete _cart.recipes[recipeId];
        }
        setCart(_cart);
    }

    function ToggleIngredientInclusion(ingredientName: string) {
        let _cart = { ...cart };
        if (ingredientName in _cart.ingredients) {
            _cart.ingredients[ingredientName].included =
                !_cart.ingredients[ingredientName].included;
            setCart(_cart);
        }
    }

    function OverrideIngredient(ingredientName: string, value: string) {
        let _cart = { ...cart };
        if (ingredientName in _cart.ingredients) {
            _cart.ingredients[ingredientName].override = true;
            _cart.ingredients[ingredientName].overrideValue = value;
            setCart(_cart);
        }
    }

    function CancelIngredientOverride(ingredientName: string) {
        let _cart = { ...cart };
        if (ingredientName in _cart.ingredients) {
            _cart.ingredients[ingredientName].override = false;
            _cart.ingredients[ingredientName].overrideValue = null;
            setCart(_cart);
        }
    }

    function ClearCart() {
        setCart({ count: 0, recipes: {}, ingredients: {} });
    }

    return (
        <CartContext.Provider
            value={{
                cart: cart,
                AddRecipeToCart: AddRecipeToCart,
                RemoveRecipeFromCart: RemoveRecipeFromCart,
                ClearCart: ClearCart,
                ToggleIngredientInclusion: ToggleIngredientInclusion,
                OverrideIngredient: OverrideIngredient,
                CancelIngredientOverride: CancelIngredientOverride,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
