"use server";

import type { Cart } from "@/types";
import GetSmithsAccessToken from "@/lib/smithsAccessToken";

export default async function AddToSmithsCart(cart: Cart) {

    const token = await GetSmithsAccessToken();
}