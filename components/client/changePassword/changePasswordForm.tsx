"use client";

import type { MySession } from "@/types";
import ChangePassword from "@/app/actions/changePassword";
import { redirect } from "next/navigation";

export default function ChangePasswordForm({session} : {session: MySession | null}) {

    if (!session || !session.user) {
        return null;
    }

    async function OnSubmit(formData : FormData) {
        if (!session || !session.user) {
            return null;
        }
        const result = await ChangePassword(session, formData.get("currentPassword") as string, formData.get("newPassword") as string);
        alert(result.message);
        if (result.success) {
            redirect("/");
        }
    }

    return (<form action={OnSubmit} className="box column">
                <h2>Change Password</h2>
                <label htmlFor="currentPassword">Current Password</label>
                <input type="password" name="currentPassword" id="currentPassword" required/>
                <label htmlFor="newPassword">New Password</label>
                <input type="password" name="newPassword" id="newPassword" required/>
                <input className="btn" type="submit" value="Change password"/>
            </form>)
}