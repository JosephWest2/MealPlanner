import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { MySession } from "@/types";
import KrogerCartClient from "@/components/client/krogerCartClient/krogerCartClient";
import { redirect } from "next/navigation";

export default async function KrogerCart() {

    const session = await getServerSession(authOptions) as MySession;
    if (!session || !session.accessToken || session.expiresAt < Date.now()) {
        redirect("/auth/kroger/signin");
    }

    return (<>
        <KrogerCartClient session={session}></KrogerCartClient>
    </>
        
    )
}
