import type { MySession, Cart, CartIngredient, MappedIngredients } from "@/types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import IngredientsClient from "../(client)/ingredientsClient";

async function GetKrogerProductInfo(ingredient: CartIngredient, session: MySession, storeId?: string | undefined, filters?: string[]) {

    let url = `https://api.kroger.com/v1/products?filter.term=${ingredient.name}`;

    if (storeId) {
        url += `&filter.locationId=${storeId}`;
    }
    let fulfillment = ""
    if (filters) {
        filters.forEach(filter => {
            if (fulfillment === "") {
                fulfillment += "&filter.fulfillment=" + filter;
            } else {
                fulfillment += "," + filter
            }
        })
        url += fulfillment;
    }
    
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + session.accessToken
        }
    });

    if (response.status == 401) {
        redirect("/auth/kroger/signin");
    }

    return response.json();
}

export default async function Ingredients({storeId, session, filters} : {storeId: string | undefined, session: MySession, filters: string[]}) {

    const cartCookie = cookies().get("mtccart");

    let cart;
    if (cartCookie && cartCookie.value) {
        cart = JSON.parse(cartCookie.value) as Cart
    } else {
        cart = undefined;
    }

    if (!cart) {
        return null
    }
    
    const promises = [];
    const keys = Object.keys(cart.ingredients);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const ingredient = cart.ingredients[key];
        promises.push(GetKrogerProductInfo(ingredient, session, storeId, filters));
    }

    const results = await Promise.all(promises);
    let mappedIngredients = {} as MappedIngredients;
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        mappedIngredients[keys[i]] = {cartIngredient: cart.ingredients[keys[i]], productOptions: result.data};
    }

    return <div className="column box">
        <h2>Shopping List</h2>
        <Suspense fallback={<p>Loading Ingredients...</p>}>
            <IngredientsClient mappedIngredients={mappedIngredients}></IngredientsClient>
        </Suspense>
    </div>

}