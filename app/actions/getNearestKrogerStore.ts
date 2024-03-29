"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { MySession } from "@/types";

export default async function getNearestKrogerStore(latitude : number | undefined, longitude : number | undefined, zipCode : string | undefined) {

    const session = await getServerSession(authOptions) as MySession;
    if (!session?.accessToken) {
        return "Invalid access token";
    }

    let query = "";
    
    if (zipCode) {
        query = "?filter.zipCode.near=" + zipCode;
    } else if (latitude && longitude) {
        query = "?filter.latLong.near=" + latitude + "," + longitude;
    }

    const response = await fetch(`https://api.kroger.com/v1/locations${query}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + session.accessToken
        }
    })

    if (response.status == 401) {
        return "Invalid access token";
    }
    const data = await response.json();
    console.log(data);
    return data.data as Array<any>;
}