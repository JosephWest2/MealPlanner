"use server";

import GetSmithsAccessToken from "@/app/actions/getSmithsAccessToken";

export default async function getNearestKrogerStore(latitude : number | undefined, longitude : number | undefined, zipCode : number | undefined) {

    let query = "";
    if (latitude && longitude) {
        query = "?filter.latLong.near=" + latitude + "," + longitude;
    } else if (zipCode) {
        query = "?filter.zipCode.near=" + zipCode;
    }

    const token = await GetSmithsAccessToken();

    const response = await fetch(`https://api.kroger.com/v1/locations${query}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + token
        }
    })

    const data = await response.json();
    return data.data as Array<any>;
}