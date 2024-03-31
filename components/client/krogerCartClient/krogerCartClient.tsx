"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GetNearestKrogerStores from "@/app/actions/getNearestKrogerStores";
import GetKrogerProductInfo from "@/app/actions/getKrogerProductInfo";
import { useContext } from "react";
import { CartContext } from "@/components/client/cartProvider/cartProvider";
import { KrogerLocation } from "@/types";
import GetLatLongDistance from "@/lib/getLatLongDistance";
import type { MappedIngredients } from "@/types";
import CartIngredients from "@/components/client/cartIngredients/cartIngredients";

export default function KrogerCartClient() {

    const { cart } = useContext(CartContext);

    const [location, setLocation] = useState<GeolocationCoordinates | undefined>(undefined);
    const [zipCode, setZipCode] = useState<string | undefined>(undefined);
    const [nearestStores, setNearestStores] = useState<KrogerLocation[] | undefined>(undefined);
    const [selectedStoreID, setSelectedStoreID] = useState<string | undefined>(undefined);
    const [mappedIngredients, setMappedIngredients] = useState<MappedIngredients | undefined>(undefined); 

    const router = useRouter();

    useEffect(() => {
        GetLocation();
    }, [])
    
    useEffect(() => {
        if (!location) {return;}
        SearchStores();
    }, [location])

    function SearchStores() {
        GetNearestKrogerStores(location?.latitude, location?.longitude, zipCode).then(data => {
            if (data == "Invalid access token") {
                router.push("/auth/kroger/signin");
                return;
            } else if (data == "Failed to fetch stores") {
                alert("Failed to fetch stores. Please try again later.");
                return;
            }
            setNearestStores(data);
            setSelectedStoreID(data[0].locationId);
        });
    }

    function SearchByZip() {
        if (!zipCode || zipCode.length !== 5) {
            alert("Please enter a valid zip code");
            return;
        }
        SearchStores();
    }

    function GetLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation(position.coords);
        });
    }

    return <div className="column">
        <h1>Kroger Checkout</h1>
        <div className="box column">
            <h2>Nearby Stores</h2>
            <div className="row">
                <p>Search by Zip Code</p>
                <input pattern="[0-9]{5}" type="text" style={{height: "2rem", width: "6rem"}} onChange={(e)=> setZipCode(e.target.value)} />
                <button style={{height: "2rem", display: "flex", alignItems: "center"}} onClick={SearchByZip}>Search</button>
            </div>
            <div className="row">
                <p>or</p>
                <button onClick={GetLocation} style={{height: "2.2rem", display: "flex", alignItems: "center"}}>use current location</button>
            </div>
            {nearestStores && <select style={{maxWidth: "24rem"}} onChange={(e) => setSelectedStoreID(e.target.value)} value={selectedStoreID}>
                {nearestStores.map((store) => {
                    let distance = undefined;
                    if (location) {
                        distance = GetLatLongDistance(location.latitude, store.geolocation.latitude, location.longitude, store.geolocation.longitude);
                        distance = Math.round(distance * 100) / 100;
                    }
                    return <option key={store.locationId} value={store.locationId}>{store.name} ({distance} mi)</option>
                })}
            </select>}
        </div>
        <CartIngredients provider={{providerName: "Kroger", locationId: selectedStoreID || null}}></CartIngredients>
        
    </div>
}