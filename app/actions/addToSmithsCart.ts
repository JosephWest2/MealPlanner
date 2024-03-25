"use server";

import type { Cart } from "@/types";
import GetSmithsAccessToken from "@/app/actions/getSmithsAccessToken";

export default async function AddToSmithsCart(cart: Cart) {

    const token = await GetSmithsAccessToken();
}