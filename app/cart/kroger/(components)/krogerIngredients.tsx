import type {
    MySession,
    MappedIngredient,
    KrogerProductInfo,
    CookieIngredients,
} from "@/types";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import KrogerIngredientsClient from "./krogerIngredientsClient";

async function GetKrogerProductInfo(
    ingredientName: string,
    session: MySession,
    storeId?: string | undefined,
    filters?: string[]
) {
    let url = `https://api.kroger.com/v1/products?filter.term=${ingredientName}`;

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

    let cookieIngredients = undefined as CookieIngredients | undefined;
    if (cookieIngredientsCookie && cookieIngredientsCookie.value) {
        cookieIngredients = JSON.parse(
            cookieIngredientsCookie.value
        ) as CookieIngredients;
    } else {
        cookieIngredients = undefined;
    }

    if (!cookieIngredients) {
        return null;
    }

    const promises = [];
    const ingredientNames = Object.keys(cookieIngredients);

    for (let i = 0; i < ingredientNames.length; i++) {
        const ingredientName = ingredientNames[i];
        promises.push(
            GetKrogerProductInfo(ingredientName, session, storeId, filters)
        );
    }

    const results = await Promise.all(promises);
    let mappedIngredients = [] as MappedIngredient[];
    for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const ingredientName = ingredientNames[i];
        const ingredient = cookieIngredients[ingredientName];
        mappedIngredients.push({
            name: ingredientName,
            included: ingredient.included,
            override: ingredient.override,
            units: ingredient.units,
            productOptions: result.data as KrogerProductInfo[] | undefined,
        })
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
