"use server";

import { CartIngredient, KrogerProductInfo } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { MySession } from "@/types";

export default async function GetKrogerProductInfo(ingredient : CartIngredient, locationId : string | null) {

    async function ProductInfo() {
        const session = await getServerSession(authOptions) as MySession;
        if (!session?.accessToken) {
            return "Invalid access token";
        }

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
        } else if (!response.ok) {
            return "Failed to fetch products";
        }
        const data = await response.json();
        return data.data as KrogerProductInfo[];
    }

    return {promise: ProductInfo()}
}