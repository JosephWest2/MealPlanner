import GetKrogerClientToken from "@/app/actions/getKrogerClientToken";
import { redirect } from "next/navigation";

export default async function KrogerAuthorize({searchParams} : {searchParams: {code: string | undefined}}) {
    const code = searchParams.code;
    if (!code) {
        redirect("/");
    }
    const token = await GetKrogerClientToken(code);
    if (!token) {
        redirect("/");
    }

    
    redirect("/");
}