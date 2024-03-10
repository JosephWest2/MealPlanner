import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import type { MySession } from "@/types";
import ChangePasswordForm from "@/components/client/changePassword/changePasswordForm";

export default async function ChangePassword() {

    const session = await getServerSession(authOptions) as MySession;
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    return (
        <ChangePasswordForm session={session}></ChangePasswordForm>
    )
}