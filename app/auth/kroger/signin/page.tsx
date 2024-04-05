import ClientRedirect from "./clientRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import type { MySession } from "@/types";

export default async function Page() {

    const session = await getServerSession(authOptions) as MySession;

    return (
        <ClientRedirect session={session}></ClientRedirect>
    );
}