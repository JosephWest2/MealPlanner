"use client";

import { useEffect, useState } from "react";
import GetNearestKrogerStores from "@/app/actions/getNearestKrogerStores";
import GetKrogerProductInfo from "@/app/actions/getKrogerProductInfo";
import { useContext } from "react";
import { CartContext } from "@/components/client/cartProvider/cartProvider";
import { KrogerLocation } from "@/types";
import GetLatLongDistance from "@/lib/getLatLongDistance";

export default function KrogerCartClient() {

    const { cart } = useContext(CartContext);

    const [location, setLocation] = useState<GeolocationCoordinates | undefined>(undefined);
    const [zipCode, setZipCode] = useState<string | undefined>(undefined);
    const [nearestStores, setNearestStores] = useState<KrogerLocation[] | undefined>(undefined);
    const [selectedStoreIndex, setSelectedStoreIndex] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (!location && !zipCode || !location && !(zipCode?.toString().length == 5)) {return;}
        GetNearestKrogerStores(location?.latitude, location?.longitude, zipCode).then(data => {
            if (data == "Invalid access token") {
                return;
            }
            setNearestStores(data);
        });
    }, [location, zipCode])

    useEffect(() => {
        if (!selectedStoreIndex && nearestStores && nearestStores[0]) {
            setSelectedStoreIndex(0);
        }
    }, [nearestStores])

    useEffect(() => {
        GetLocation();
    }, [])

    function GetLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation(position.coords);
        }, () => {
            alert("Location permissions declined by user.");
        })
    }

    function NearestStores() {

        if (!nearestStores) {
            return <></>
        }

        function OnChange(e : any) {
            setSelectedStoreIndex(Number(e.target.value))
        }
        
        return <>
            <select name="selectedStore" id="selectedStore" onChange={OnChange} value={selectedStoreIndex}>
                {nearestStores.map((store, index) => {
                    let distance = undefined;
                    if (location) {
                        distance = GetLatLongDistance(location.latitude, store.geolocation.latitude, location.longitude, store.geolocation.longitude);
                        distance = Math.round(distance * 100) / 100;
                    }
                    return <option key={index} value={index}>{store.name} {distance} mi</option>
                })}
            </select>
        </>
    }

    return <>
    
        <NearestStores></NearestStores>
        
        <p>{location?.latitude} {location?.longitude}</p>
        <p>{zipCode}</p>

        <div className="row">Find nearby stores by Zip Code <input pattern="[0-9]{5}" type="text" style={{height: "2rem", width: "6rem"}} onChange={(e)=> setZipCode(e.target.value)} /> or <button onClick={GetLocation} style={{height: "2rem", display: "flex", alignItems: "center"}}>use current location</button></div>
        <button onClick={() => {
            if (cart?.ingredients) {
                GetKrogerProductInfo(cart.ingredients, undefined);
            }
        }}>Query Product API</button>
    </>
}