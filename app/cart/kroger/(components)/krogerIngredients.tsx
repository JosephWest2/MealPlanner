import type {
    MySession,
    CartIngredient,
    MappedIngredient,
    KrogerProductInfo,
    CookieIngredients,
} from "@/types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import KrogerIngredientsClient from "./krogerIngredientsClient";

async function GetKrogerProductInfo(
    ingredient: CartIngredient,
    session: MySession,
    storeId?: string | undefined,
    filters?: string[]
) {
    let url = `https://api.kroger.com/v1/products?filter.term=${ingredient.name}`;

    if (storeId) {
        url += `&filter.locationId=${storeId}`;
    }
    let fulfillment = "";
    if (filters) {
        filters.forEach((filter) => {
            if (fulfillment === "") {
                fulfillment += "&filter.fulfillment=" + filter;
            } else {
                fulfillment += "," + filter;
            }
        });
        url += fulfillment;
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + session.accessToken,
        },
    });

    if (response.status == 401) {
        redirect("/auth/kroger/signin");
    }

    return response.json();
}

export default async function Ingredients({
    storeId,
    session,
    filters,
}: {
    storeId: string | undefined;
    session: MySession;
    filters: string[];
}) {
    const cookieIngredientsCookie = cookies().get("mtcingredients");

    let cookieIngredients;
    if (cookieIngredientsCookie && cookieIngredientsCookie.value) {
        cookieIngredients = JSON.parse(cookieIngredientsCookie.value) as CookieIngredients;
    } else {
        cookieIngredients = undefined;
    }

    if (!cookieIngredients) {
        return null;
    }

    const promises = [];
    const keys = Object.keys(cookieIngredients.ingredients);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const ingredient = cookieIngredients.ingredients[key];
        promises.push(
            GetKrogerProductInfo(ingredient, session, storeId, filters)
        );
    }

    const results = await Promise.all(promises);
    let mappedIngredients = [] as MappedIngredient[];
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        mappedIngredients[keys[i]] = {
            cookieIngredient: cookieIngredients.ingredients[keys[i]],
            productOptions: result.data as KrogerProductInfo[],
        };
    }

    return (
        <div className="column box">
            <h2>Shopping List</h2>
            <Suspense fallback={<p>Loading Ingredients...</p>}>
                <KrogerIngredientsClient
                    mappedIngredients={mappedIngredients}
                ></KrogerIngredientsClient>
            </Suspense>
        </div>
    );
}
