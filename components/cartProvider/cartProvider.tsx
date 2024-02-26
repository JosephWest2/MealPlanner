"use client";

import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import type { Recipe, Ingredient } from "@/app/Recipes/page";
import { Guid } from "js-guid";

export const CartContext = createContext({cart: null as cart | null, AddRecipeToCart: null as Function | null, RemoveRecipeFromCart: null as Function | null, ClearCart: null as Function | null});

export default function CartProvider({ children } : any) {
    const [cookies, setCookie] = useCookies(["cart"]);
    const [cart, setCart] = useState(cookies.cart as cart || {count: 0, recipes: [], ingredients: []} as cart);

    useEffect(() => {
        setCookie("cart", JSON.stringify(cart), {maxAge: 3600});
        console.log(cart);
    }, [cart])

    function AddRecipeToCart(recipe: Recipe) {
        let _cart = {...cart};
        const guid = Guid.newGuid();
        for (let i = 0; i < recipe.nutrition.ingredients.length; i++) {
            const ingredient = recipe.nutrition.ingredients[i];
            _cart.ingredients.push({name: ingredient.name, amount: ingredient.amount, unit: ingredient.unit, associatedRecipe: guid, included: true})
        }
        _cart.recipes.push({id: recipe.id, name: recipe.title, guid: guid});
        setCart(_cart);
    }

    function RemoveRecipeFromCart(recipe: Recipe) {
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
            for (let i = 0; i < cart.ingredients.length; i++) {
                if (cart.ingredients[i].associatedRecipe === guid) {
                    _cart.ingredients.splice(i, 1);
                }
            }
        }
        setCart(_cart);
    }

    function ClearCart() {
        setCart({count: 0, recipes: [], ingredients: []});
    }

    return (
        <CartContext.Provider value={{cart: cart, AddRecipeToCart: AddRecipeToCart, RemoveRecipeFromCart: RemoveRecipeFromCart, ClearCart: ClearCart}}>
            {children}
        </CartContext.Provider>
    );
}

type cart = {
    count: number,
    recipes: cartRecipe[]
    ingredients: cartIngredient[]
}

type cartRecipe = {
    name: string
    id: number
    guid: Guid
}

type cartIngredient = {
    name: string
    amount: number
    unit: string
    included: boolean
    associatedRecipe: Guid
}