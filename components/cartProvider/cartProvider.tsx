"use client";

import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import type { Recipe, Ingredient } from "@/app/Recipes/page";
import { Guid } from "js-guid";

export const CartContext = createContext({cart: null as cart | null, AddRecipeToCart: null as any, RemoveRecipeFromCart: null as any, ClearCart: null as any, ToggleIngredientInclusion: null as any});

export default function CartProvider({ children } : any) {
    const [cookies, setCookie] = useCookies(["cart"]);
    const [cart, setCart] = useState(cookies.cart as cart || {count: 0, recipes: [], ingredients: []} as cart);

    useEffect(() => {
        setCookie("cart", JSON.stringify(cart), {maxAge: 3600});
        console.log(cart);
    }, [cart])

    function AddRecipeToCart(recipe: Recipe) {
        let _cart = {...cart};
        const guid = Guid.newGuid().toString();
        for (let i = 0; i < recipe.extendedIngredients.length; i++) {
            const ingredient = recipe.extendedIngredients[i];
            _cart.ingredients.push({name: ingredient.name, amount: ingredient.amount, unit: ingredient.unit, associatedRecipeGUID: guid, included: true})
        }
        _cart.recipes.push({id: recipe.id, name: recipe.title, guid: guid});
        _cart.count++;
        console.log(_cart);
        setCart(_cart);
    }

    function RemoveRecipeFromCart(recipe: Recipe | cartRecipe) {
        let _cart = {...cart};
        let guid = null;
        for (let i = 0; i < cart.recipes.length; i++) {
            if (_cart.recipes[i].id === recipe.id) {
                guid = _cart.recipes[i].guid;
                _cart.recipes.splice(i, 1);
                break;
            }
        }
        if (guid !== null) {
            let i = 0;
            while (i < cart.ingredients.length) {
                if (cart.ingredients[i].associatedRecipeGUID === guid) {
                    _cart.ingredients.splice(i, 1);
                }
                else {
                    i++;
                }
            }
        }
        _cart.count--;
        console.log(_cart);
        setCart(_cart);
    }

    function ToggleIngredientInclusion(Ingredient: cartIngredient) {
        let _cart = {...cart};
        for (let i = 0; i < _cart.ingredients.length; i++) {
            if (_cart.ingredients[i].name === Ingredient.name && _cart.ingredients[i].associatedRecipeGUID === Ingredient.associatedRecipeGUID) {
                _cart.ingredients[i].included = !_cart.ingredients[i].included;
                setCart(_cart);
                return;
            }
        }
    }

    function ClearCart() {
        setCart({count: 0, recipes: [], ingredients: []});
    }

    return (
        <CartContext.Provider value={{cart: cart, AddRecipeToCart: AddRecipeToCart, RemoveRecipeFromCart: RemoveRecipeFromCart, ClearCart: ClearCart, ToggleIngredientInclusion: ToggleIngredientInclusion}}>
            {children}
        </CartContext.Provider>
    );
}

export type cart = {
    count: number,
    recipes: cartRecipe[]
    ingredients: cartIngredient[]
}

export type cartRecipe = {
    name: string
    id: number
    guid: string
}

export type cartIngredient = {
    name: string
    amount: number
    unit: string
    included: boolean
    associatedRecipeGUID: string
}