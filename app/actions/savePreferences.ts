"use server";

import { prisma } from "@/lib/prismaSingleton";
import { getServerSession } from "next-auth";
import { MySession, authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { EncodeNutrientLimits } from "@/app/account/page";

export type Preferences = {
    diet: string | null
    mealType: string | null
    intolerances: string[]
    cuisine: string | null
    maxReadyTime: number | null
    nutrientLimits: NutrientLimit | null
}

export type NutrientLimit = {
    [key: string]: number
}

export default async function SavePreferences(preferences: Preferences) {

    const session = await getServerSession(authOptions) as MySession;

    if (!session || !session.user) {
        throw new Error("User not authenticated");
    }

    let _nutrientLimits = undefined;
    if (preferences.nutrientLimits) {
        _nutrientLimits = EncodeNutrientLimits(preferences.nutrientLimits);
    }
    
    const result = await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            diet: preferences.diet,
            mealType: preferences.mealType,
            intolerances: preferences.intolerances,
            cuisine: preferences.cuisine,
            maxReadyTime: preferences.maxReadyTime,
            nutrientLimits: preferences.nutrientLimits
        }
    })
    
    if (!result) {
        return {success: false}
    }

    console.log(result);
    revalidatePath("/account");
    return {success: true}
}