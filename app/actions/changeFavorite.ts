"use server";

import { prisma } from "@/lib/prismaSingleton";
import { getServerSession } from "next-auth";
import { MySession, authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export default async function changeFavorite(recipeId : number, isFavorited: boolean) {

    const session = await getServerSession(authOptions) as MySession;

    if (!session || !session.user) {
        throw new Error("User not authenticated");
    }

    console.log(isFavorited, recipeId);
    
    if (isFavorited) {
        await prisma.recipeRef.create({
            data: {
                userId: session.user.id,
                recipeId: recipeId
            }
        });
    } else {
        await prisma.recipeRef.deleteMany({
            where: {
                userId: session.user.id,
                recipeId: recipeId
            },
        });
    }

    revalidatePath("/");
}