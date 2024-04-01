import type { MySession, Cart, CartIngredient, MappedIngredients } from "@/types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import KrogerCartIngredient from "../(client)/ingredient"

async function GetKrogerProductInfo(ingredient: CartIngredient, session: MySession, storeId?: string | undefined) {

    let url = `https://api.kroger.com/v1/products?filter.term=${ingredient.name}&filter.fulfillment=ais`;

    if (storeId) {
        url += `&filter.locationId=${storeId}`;
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

export default async function Ingredients({storeId, session} : {storeId: string | undefined, session: MySession}) {

    const cartCookie = cookies().get("cart");

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
        promises.push(GetKrogerProductInfo(ingredient, session, storeId));
    }

    const results = await Promise.all(promises);
    let mappedIngredients = {} as MappedIngredients;
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        mappedIngredients[keys[i]] = {cartIngredient: cart.ingredients[keys[i]], productOptions: result.data};
    }

    return <div className="column box">
        <h2>Ingredients</h2>
        <Suspense fallback={<p>Loading Ingredients...</p>}>
            <ol className="column">
                {Object.keys(mappedIngredients).map((ingredientName: string) => {
                    const ingredient = mappedIngredients[ingredientName];
                    return <KrogerCartIngredient locationId={null} ingredient={ingredient.cartIngredient} key={ingredientName}></KrogerCartIngredient>
                })}
            </ol>
        </Suspense>
    </div>

}