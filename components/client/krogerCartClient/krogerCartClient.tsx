"use client";

import { MySession } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import getNearestKrogerStore from "@/app/actions/getNearestKrogerStore";
import GetKrogerProductInfo from "@/app/actions/getKrogerProductInfo";
import { useContext } from "react";
import { CartContext } from "@/components/client/cartProvider/cartProvider";

export default function KrogerCartClient({session} : {session: MySession}) {

    const { cart } = useContext(CartContext);
    const router = useRouter();

    const [location, setLocation] = useState<GeolocationCoordinates | undefined>(undefined);
    const [zipCode, setZipCode] = useState<string | undefined>(undefined);
    const [nearestStores, setNearestStores] = useState<any[] | undefined>(undefined);

    useEffect(() => {
        if (!location && !zipCode || !location && !(zipCode?.toString().length == 5)) {return;}
        getNearestKrogerStore(location?.latitude, location?.longitude, zipCode).then(data => {
            if (data == "Invalid access token") {
                router.push("/auth/kroger/signin");
                return;
            }
            setNearestStores(data);
        });
    }, [location, zipCode])

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

    return <>
    
        <p>{nearestStores ? nearestStores[0].name : null}</p>
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