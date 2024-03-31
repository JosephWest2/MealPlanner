import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { MySession, Cart, KrogerLocation, KrogerProductInfo, CartIngredient, MappedIngredient, MappedIngredients } from "@/types";
import KrogerCartClient from "@/components/client/krogerCartClient/krogerCartClient";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import KrogerCartIngredients from "@/components/client/krogerCartIngredients/krogerCartIngredients";

export default async function KrogerCart(params: {storeLocationId: string | undefined, lat: string | undefined, lon: string | undefined, zip: string | undefined}) {

    const cartCookie = cookies().get("cart");

    let cart;
    if (cartCookie && cartCookie.value) {
        cart = JSON.parse(cartCookie.value) as Cart
    } else {
        cart = undefined;
    }

    const session = await getServerSession(authOptions) as MySession;
    if (!session || !session.accessToken || session.expiresAt < Date.now()) {
        redirect("/auth/kroger/signin");
    }

    if (!cart) {
        return <div className="box column">
            <h3>Cart is empty</h3>
            <Link href="/">Return to recipes</Link>
        </div>
    }

    async function GetNearestStores() {
    
        let query = "";
        if (params.zip) {
            query = "?filter.zipCode.near=" + params.zip;
        } else if (params.lat && params.lon) {
            query = "?filter.latLong.near=" + params.lat + "," + params.lon;
        }
    
        const response = await fetch(`https://api.kroger.com/v1/locations${query}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + session.accessToken
            }
        })
    
        if (response.status == 401) {
            return "Invalid access token";
        } else if (!response.ok) {
            return "Failed to fetch stores";
        }
        const data = await response.json();
        return data.data.slice(0,5) as Array<KrogerLocation>;
    }

    async function GetKrogerProductInfo(ingredient: CartIngredient) {

        let url = `https://api.kroger.com/v1/products?filter.term=${ingredient.name}&filter.fulfillment=ais`;

        if (params.storeLocationId) {
            url += `&filter.locationId=${params.storeLocationId}`;
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
        const productInfo = data.data as KrogerProductInfo[];
        return {cartIngredient: ingredient, productOptions: productInfo} as MappedIngredient;
    }

    let mappedIngredients = null as MappedIngredients | null;

    const keys = Object.keys(cart.ingredients);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const ingredient = cart.ingredients[key];
        const result = await GetKrogerProductInfo(ingredient);
        if (result === "Invalid access token") {
            redirect("/auth/kroger/signin");
        } else if (result === "Failed to fetch products") {
            console.log("Failed to fetch products");
            continue;
        }
        if (mappedIngredients === null) {
            mappedIngredients = {};
        }
        mappedIngredients[key] = result;
    }

    let nearestStores = null as KrogerLocation[] | null;
    const storeSearchResult = await GetNearestStores();
    if (storeSearchResult === "Invalid access token") {
        redirect("/auth/kroger/signin");
    } else if (storeSearchResult === "Failed to fetch stores") {
        console.log("Failed to fetch stores");
    } else {
        nearestStores = storeSearchResult;
    }

    return (<>
        <KrogerCartIngredients mappedIngredients={mappedIngredients}></KrogerCartIngredients>
        <KrogerCartClient></KrogerCartClient>
    </>
        
    )
}
