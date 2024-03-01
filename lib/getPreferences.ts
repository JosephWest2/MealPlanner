import { prisma } from "@/lib/prismaSingleton";
import type { RecipeSearchParams, MySession, NutrientLimits } from "@/types";

export async function GetPreferences(session: MySession) {

    let preferences = {
        diet: null,
        mealType: "main course",
        intolerances: [],
        cuisine: null,
        maxReadyTime: 30,
        nutrientLimits: null
    } as RecipeSearchParams;

    if (!session || !session.user) {
        return preferences;
    }

    const dbPreferences = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }, select: {
            diet: true,
            mealType: true,
            intolerances: true,
            cuisine: true,
            maxReadyTime: true,
            nutrientLimits: true
        }
    })

    
    if (dbPreferences) {
        preferences = {
            diet: dbPreferences.diet,
            mealType: dbPreferences.mealType || "main course",
            intolerances: dbPreferences.intolerances,
            cuisine: dbPreferences.cuisine,
            maxReadyTime: dbPreferences.maxReadyTime || 30,
            nutrientLimits: dbPreferences.nutrientLimits ? DecodeNutrientLimits(dbPreferences.nutrientLimits) : null
        }
    }

    return preferences;
}

export function DecodeNutrientLimits(limits: string) {
    return JSON.parse(limits) as NutrientLimits;
}

export function EncodeNutrientLimits(limits: NutrientLimits) {
    return JSON.stringify(limits);
}