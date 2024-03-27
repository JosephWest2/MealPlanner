"use server";

import { DynamicIngredients } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { MySession } from "@/types";

export default async function GetKrogerProductInfo(ingredients : DynamicIngredients) {

    const session = await getServerSession(authOptions) as MySession;
    if (!session?.accessToken) {
        return "Invalid access token";
    }

    

    Object.keys(ingredients).forEach(key => {
        const ingredient = ingredients[key];

    });


}