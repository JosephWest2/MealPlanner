"use server";

import { DynamicIngredients, MappedIngredients } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { MySession } from "@/types";

export default async function GetKrogerProductInfo(ingredients : DynamicIngredients, locationId : string | undefined) {

    const session = await getServerSession(authOptions) as MySession;
    if (!session?.accessToken) {
        return "Invalid access token";
    }

    
    const mappedIngredients = {} as MappedIngredients;

    Object.keys(ingredients).forEach(async (key) => {
        const ingredient = ingredients[key];

        let url = `https://api.kroger.com/v1/products?filter.term=${ingredient.name}&filter.fulfillment=ais`;

        if (locationId) {
            url += `&filter.locationId=${locationId}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + session.accessToken
            }
        });

        if (response.status == 401) {
            return "Invalid access token";
        }

        const data = await response.json();
        console.log(data);
    });


}