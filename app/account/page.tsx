import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import styles from "./page.module.css";
import PreferencesForm from "@/components/client/preferences/preferencesForm";
import type { MySession, RecipeSearchParams } from "@/types";
import { GetPreferences } from "@/lib/getPreferences";
import Link from "next/link";

export default async function Account() {

    const session = await getServerSession(authOptions) as MySession;
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    const preferences : RecipeSearchParams = await GetPreferences(session);

    return (
        <div className="column">
            <div className="box column">
                <h1 className={styles.header}>Account</h1>
                <p><b>Email:</b> {session.user.email}</p>
                <p><b>Name:</b> {session.user.name}</p>
                <p><b>Id:</b> {session.user.id}</p>
                <Link className="btn" href="/changepassword">Change Pasword</Link>
                <Link className="btn" href="/api/auth/signout">Sign Out</Link>
            </div>
            <div className="box column">
                <h1>Search Defaults</h1>
                <PreferencesForm session={session} initialPreferences={preferences}></PreferencesForm>
            </div>
            <div className="box column">
                <h1>Favorites / History</h1>
            </div>
        </div>
    )
}

