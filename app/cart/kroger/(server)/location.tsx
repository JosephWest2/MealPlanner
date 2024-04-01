import type { MySession, KrogerLocation } from "@/types";
import { redirect } from "next/navigation";
import LocationClient from "../(client)/locationClient";
import { Suspense } from "react";

export default async function Location({zip, lat, lon, session} : {zip: string | undefined, lat: string | undefined, lon: string | undefined, session: MySession}) {

    let query = "";
    if (zip) {
        query = "?filter.zipCode.near=" + zip;
    } else if (lat && lon) {
        query = "?filter.latLong.near=" + lat + "," + lon;
    }

    const response = await fetch(`https://api.kroger.com/v1/locations${query}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + session.accessToken
        }
    })

    if (response.status == 401) {
        redirect("/auth/kroger/signin");
    } else if (!response.ok) {
        return <p>"Failed to fetch stores</p>;
    }

    const data = await response.json();
    const nearestStores = data.data.slice(0,5) as Array<KrogerLocation>;

    return <Suspense fallback={<div className="box">Loading Locations...</div>}>
            <LocationClient locations={nearestStores} userPosition={{lat: Number(lat), lon: Number(lon)}}></LocationClient>
        </Suspense>
}