"use server";

import { prisma } from "@/lib/prismaSingleton";
import { hash } from "bcrypt";

export default async function Register(password: string, email: string) {

    if (!email || !password) {
        return {
            success: false,
            message: "invalid email or password"
        }
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (user) {
        return {
            success: false,
            message: "user already exists"
        }
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword
        }
    })

    return {
        success: true,
        message: "registered successfully"
    }

}