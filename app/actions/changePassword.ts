"use server";

import { prisma } from "@/lib/prismaSingleton";
import { hash, compare } from "bcrypt";
import type { MySession } from "@/types";

export default async function ChangePassword(session: MySession | null, currentPassword: string, newPassword: string) {

    if (!session || !session.user) {
        return {
            success: false,
            message: "user is not logged in"
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    })

    if (!user) {
        return {
            success: false,
            message: "user not found"
        }
    }

    if (!user.password) {
        return {
            success: false,
            message: "Please register with your email and password"
        }
    }

    const validated = await compare(currentPassword, user.password);

    if (!validated) {
        return {
            success: false,
            message: "Incorrect current password"
        }
    }

    const hashedPassword = await hash(newPassword, 12);

    await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            password: hashedPassword
        }
    })

    return {
        success: true,
        message: "Password changed successfully"
    }

}