"use client";

import GetLatLonDistance from "@/lib/getLatLonDistance";
import type { KrogerLocation } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GetNearestKrogerStores from "@/app/actions/getNearestKrogerStores";

export default function Location() {

    const router = useRouter();
    const [zip, setZip] = useState("");
    const [selectedStoreID, setSelectedStoreID] = useState<string>();
    const [storeOptions, setStoreOptions] = useState<KrogerLocation[]>();
    const [position, setPosition] = useState<{lat:number, lon:number}>();
    const [ais, setAis] = useState(true);
    const [csp, setCsp] = useState(false);
    const [dth, setDth] = useState(false);

    function SearchByZip() {
        if (RegExp("[0-9]{5}").test(zip) && zip.length === 5) {
            UpdateStoreOptions({lat: undefined, lon: undefined, zip: zip});
        } else {
            alert("invalid zip code");
        }
    }

    function GetLocation() {
        navigator?.geolocation?.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setPosition({lat: lat, lon: lon});
            UpdateStoreOptions({lat: lat, lon: lon, zip: undefined});
        }, () => {
            alert("failed to get location");
        });
    }

    function UpdateStoreOptions({ lat, lon, zip } : { lat: number | undefined, lon: number | undefined, zip: string |undefined}) {
        GetNearestKrogerStores(lat, lon, zip).then((stores) => {
            setStoreOptions(stores);
        })
    }

    function ChangeStores() {
        let filters = ""
        if (ais) {
            filters += "&ais=true"
        }
        if (csp) {
            filters += "&csp=true"
        }
        if (dth) {
            filters += "&dth=true"
        }
        if (selectedStoreID) {
            router.push(`/cart/kroger?storeId=${selectedStoreID}${filters}`);
        }
    }

    return <div className="box column" style={{width: "fit-content"}}>
        <h2>Filter by store</h2>
        <div className="row">
            <p>Search by Zip Code</p>
            <div className="conjoinedContainer">
                <input className="conjoinedLeft" pattern="[0-9]{5}" type="text" style={{height: "2rem", width: "6rem"}} value={zip} onChange={(e)=> setZip(e.target.value)} />
                <button className="conjoinedRight" style={{height: "2rem", display: "flex", alignItems: "center"}} onClick={SearchByZip}>Search</button>
            </div>
            <p>or</p>
            <button onClick={GetLocation} style={{height: "2.2rem", display: "flex", alignItems: "center"}}>use current location</button>
        </div>
        {storeOptions && <><select value={selectedStoreID} onChange={e => setSelectedStoreID(e.target.value)}>
            <option value={undefined}>Select a store</option>
            {storeOptions.map(location => {
                let distance = null;
                if (position) {
                    distance = GetLatLonDistance(position.lat, location.geolocation.latitude, position.lon, location.geolocation.longitude);
                    distance = Math.round(distance * 100) / 100
                }
                return <option key={location.locationId} value={location.locationId}>{location.name} {distance ? `(${distance} mi)` : ""}</option>
            })}
        </select>
        <div style={{display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr", maxWidth: "fit-content"}}>
            <h3 style={{color: "grey", gridColumn: "span 2"}}>Ingredient filters:</h3>
            <p>Available in store</p>
            <input type="checkbox" checked={ais} onChange={e => setAis(e.target.checked)} />
            <p>Curbside pickup</p>
            <input type="checkbox" checked={csp} onChange={e => setCsp(e.target.checked)} />
            <p>Delivery to home</p>
            <input type="checkbox" checked={dth} onChange={e => setDth(e.target.checked)} />
        </div>
        
        
        
        <button onClick={ChangeStores}>Apply filters</button>
        </>}

    </div>

}