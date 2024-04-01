"use client";

import GetLatLonDistance from "@/lib/getLatLonDistance";
import type { KrogerLocation } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GetNearestKrogerStores from "@/app/actions/getNearestKrogerStores";

export default function LocationClient({locations, userPosition} : {locations : KrogerLocation[] | null, userPosition: {lat: number, lon: number} | null}) {

    const router = useRouter();
    const [zip, setZip] = useState("");
    const [selectedStoreID, setSelectedStoreID] = useState<string>();
    const [loading, setLoading] = useState(false)

    function SearchByZip() {
        if (RegExp("[0-9]{5}").test(zip) && zip.length === 5) {
            ReRoute();
        } else {
            alert("invalid zip code");
        }
    }

    function GetLocation() {
        navigator?.geolocation?.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            ReRoute({lat, lon});
        }, () => {
            alert("failed to get location");
        });
    }

    function ChangeStores() {
        if (selectedStoreID) {
            ReRoute();
        }
    }

    function ReRoute(position?: {lat: number, lon: number}) {
        let params = "?";
        if (selectedStoreID) {
            params += `storeId=${selectedStoreID}&`;
        }
        if (zip) {
            params += `zip=${zip}&`;
        }
        if (position) {
            params += `lat=${position.lat}&lon=${position.lon}`;
        } else if (userPosition) {
            params += `lat=${userPosition.lat}&lon=${userPosition.lon}`;
        }
        setLoading(true);
        router.push(`/cart/kroger${params}`);
    }

    return <div className="box column">
        <h2>Nearby Stores</h2>
        <div className="row">
            <p>Search by Zip Code</p>
            <input pattern="[0-9]{5}" type="text" style={{height: "2rem", width: "6rem"}} value={zip} onChange={(e)=> setZip(e.target.value)} />
            <button style={{height: "2rem", display: "flex", alignItems: "center"}} onClick={SearchByZip}>Search</button>
        </div>
        <div className="row">
            <p>or</p>
            <button onClick={GetLocation} style={{height: "2.2rem", display: "flex", alignItems: "center"}}>use current location</button>
        </div>
        {locations && !loading && <><select value={selectedStoreID} onChange={e => setSelectedStoreID(e.target.value)}>
            <option value={undefined}>Select a store</option>
            {locations.map(location => {
                let distance = null;
                if (userPosition) {
                    distance = GetLatLonDistance(userPosition.lat, location.geolocation.latitude, userPosition.lon, location.geolocation.longitude);
                }
                return <option key={location.locationId} value={location.locationId}>{location.name} {distance ? `(${distance} mi)` : ""}</option>
            })}
        </select>
        <button onClick={ChangeStores}>Change stores</button>
        </>}

    </div>

}