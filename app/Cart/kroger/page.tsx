import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { MySession } from "@/types";
import KrogerCartClient from "@/components/client/krogerCartClient/krogerCartClient";
import getNearestKrogerStore from "@/app/actions/getNearestKrogerStore";

export default async function KrogerCart() {

    const session = await getServerSession(authOptions) as MySession;

    return (<>
        <KrogerCartClient session={session}></KrogerCartClient>
    </>
        
    )
}
