import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import PreferencesForm from "@/components/client/preferences/preferencesForm";
import { prisma } from "@/lib/prismaSingleton";
import type { MySession, NutrientLimit, SearchParams } from "@/types";

export default async function Account() {

    const session = await getServerSession(authOptions) as MySession;
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    const _session = session as MySession;
    const initialPreferences = await prisma.user.findUnique({
        where: {
            id: _session.user.id
        }, select: {
            diet: true,
            mealType: true,
            intolerances: true,
            cuisine: true,
            maxReadyTime: true,
            nutrientLimits: true
        }
    })

    let clientInit = {} as SearchParams;
    if (initialPreferences) {
        clientInit = {
            diet: initialPreferences.diet,
            mealType: initialPreferences.mealType || "main course",
            intolerances: initialPreferences.intolerances,
            cuisine: initialPreferences.cuisine,
            maxReadyTime: initialPreferences.maxReadyTime || 30,
            nutrientLimits: initialPreferences.nutrientLimits ? DecodeNutrientLimits(initialPreferences.nutrientLimits) : null
        }
    }

    return (
        <>
            <div className={styles.infoBox}>
                <h1 className={styles.header}>Account</h1>
                <p><b>Email:</b> {session.user.email}</p>
                <p><b>Name:</b> {session.user.name}</p>
                <p><b>Id:</b> {session.user.id}</p>
                <button className={styles.button}>Change Password</button>
                <a className={styles.button} href="/api/auth/signout">Sign Out</a>
            </div>
            <div className={styles.infoBox}>
                <h1>Preferences</h1>
                <PreferencesForm session={session} initialPreferences={clientInit}></PreferencesForm>
            </div>
            <div className={styles.infoBox}>
                <h1>Favorites / History</h1>
            </div>
        </>
    )
}

export function DecodeNutrientLimits(limits: string) {
    return JSON.parse(limits) as NutrientLimit;
}

export function EncodeNutrientLimits(limits: NutrientLimit) {
    return JSON.stringify(limits);
}