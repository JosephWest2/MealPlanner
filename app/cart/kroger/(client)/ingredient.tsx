"use client";

import type { CartIngredient } from "@/types";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/client/cartProvider/cartProvider";
import styles from "./krogerIngredient.module.css";
import GetKrogerProductInfo from "@/app/actions/getKrogerProductInfo";
import type { KrogerProductInfo } from "@/types";
import Image from "next/image";

export default function Ingredient({ingredient, locationId} : {ingredient: CartIngredient, locationId: string | null}) {

    if (!ingredient) {
        return null;
    }
    const {ToggleIngredientInclusion, OverrideIngredient, CancelIngredientOverride} = useContext(CartContext);
    const [overrideAmount, setOverrideAmount] = useState<number>(0);
    const [krogerProductInfo, setKrogerProductInfo] = useState<KrogerProductInfo[]>();
    const [selectedProductID, setSelectedProductID] = useState<string>();
    const [productImageURL, setProductImageURL] = useState<string | undefined>();

    useEffect(() => {
        GetKrogerProductInfo(ingredient, locationId).then(res => {
            res.promise.then(data => {
                console.log(data);
                if (data == "Invalid access token") {
                    return;
                } else if (data == "Failed to fetch products") {
                    return;
                }
                setKrogerProductInfo(data);
                setSelectedProductID(data[0].productId);
            })
            
        });
    }, []);

    useEffect(() => {

        const product = krogerProductInfo?.find(product => product.productId === selectedProductID);
        if (!product) {return;}
        const url = product.images.find(image => image.perspective == "front")?.sizes[0].url;
        setProductImageURL(url);
        
    }, [selectedProductID])
    
    function Override() {
        if (ingredient.override) {
            CancelIngredientOverride(ingredient.name);
        } else {
            OverrideIngredient(ingredient.name, overrideAmount);
        }
        setOverrideAmount(0);
    }

    return (
        <li className={styles.ingredientItem} data-included={ingredient.included}>
            <p>{ingredient.name} <span {...(ingredient.override && {style:{color: "red"}})}>{ingredient.overrideValue || ingredient.totalAmount}</span> {ingredient.unit}</p>
            <div className="row" style={{gap: "0"}}>
                <input value={overrideAmount !== 0 ? overrideAmount : ""} onChange={(e) => setOverrideAmount(Number(e.target.value))} className={styles.ingredientOverrideInput} type="number" min="0" {...(ingredient.override && {"data-enabled":"false", disabled:true})}/>
                <button onClick={Override} className={styles.ingredientOverrideSubmit} data-override={ingredient.override}>{ingredient.override ? "Cancel" : "Override"}</button>
            </div>
            <select style={{maxWidth: "20rem"}} value={selectedProductID || ""} onChange={(e) => setSelectedProductID(e.target.value)}>
                {krogerProductInfo?.map((product) => {
                    return <option key={product.productId} value={product.productId}>{product.description}</option>
                })}
            </select>
            {productImageURL ? <Image src={productImageURL} alt="product image" width={100} height={80}/> : <div></div>}
            <label htmlFor="include">Include</label>
            <input className={styles.ingredientCheckbox} type="checkbox" onClick={() => ToggleIngredientInclusion(ingredient.name)} defaultChecked={ingredient.included || false}/>
        </li>
    )
}