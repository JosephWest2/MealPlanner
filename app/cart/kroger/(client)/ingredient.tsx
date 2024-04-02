"use client";

import type { MappedIngredient } from "@/types";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/client/cartProvider/cartProvider";
import styles from "./krogerIngredient.module.css";
import Image from "next/image";

export default function Ingredient({mappedIngredient, UpdateSelectionCallback, ToggleInclusionCallback} : {mappedIngredient: MappedIngredient, UpdateSelectionCallback: (ingredientName: string, productId: string) => void, ToggleInclusionCallback: (ingredientName: string) => void}) {

    const {ToggleIngredientInclusion, OverrideIngredient, CancelIngredientOverride} = useContext(CartContext);
    const [overrideAmount, setOverrideAmount] = useState<number>(0);
    const [overrideBuffer, setOverrideBuffer] = useState<number>(0);
    const [selectedProductID, setSelectedProductID] = useState<string>(mappedIngredient.productOptions[0].productId);
    const [productImageURL, setProductImageURL] = useState<string | undefined>(mappedIngredient.productOptions[0].images.find(image => image.perspective == "front")?.sizes[0].url);
    const [included, setIncluded] = useState(mappedIngredient.cartIngredient.included);
    const [overrided, setOverrided] = useState(mappedIngredient.cartIngredient.override);

    const cartIngredient = mappedIngredient.cartIngredient;

    useEffect(() => {
        const product = mappedIngredient.productOptions.find(product => product.productId === selectedProductID);
        if (!product) {return;}
        const url = product.images.find(image => image.perspective == "front")?.sizes[0].url;
        setProductImageURL(url);
        
    }, [selectedProductID])

    function ToggleInclusion() {
        setIncluded(!included);
        ToggleInclusionCallback(cartIngredient.name);
        ToggleIngredientInclusion(cartIngredient.name);
    }

    function UpdateSelection(e : ChangeEvent<HTMLSelectElement>) {
        const newID = e.target.value;
        setSelectedProductID(newID);
        UpdateSelectionCallback(cartIngredient.name, newID);
    }
    
    function Override() {
        if (overrided) {
            CancelIngredientOverride(cartIngredient.name);
        } else {
            OverrideIngredient(cartIngredient.name, overrideAmount);
        }
        setOverrideAmount(overrideBuffer);
        setOverrideBuffer(0);
        setOverrided(!overrided);
    }

    return (
        <li className={styles.ingredientItem} data-included={included}>
            <p>{cartIngredient.name} <span {...(overrided && {style:{color: "red"}})}>{overrideAmount || cartIngredient.totalAmount}</span> {cartIngredient.unit}</p>
            <div className="row" style={{gap: "0"}}>
                <input value={overrideBuffer === 0 ? "" : overrideBuffer} onChange={(e) => setOverrideBuffer(Number(e.target.value))} className={styles.ingredientOverrideInput} type="number" min="0" {...(overrided && {"data-enabled":"false", disabled:true})}/>
                <button onClick={Override} className={styles.ingredientOverrideSubmit} data-override={overrided}>{overrided ? "Cancel" : "Override"}</button>
            </div>
            <select style={{maxWidth: "20rem"}} value={selectedProductID || ""} onChange={UpdateSelection}>
                {mappedIngredient.productOptions.map((product) => {
                    return <option key={product.productId} value={product.productId}>{product.description}</option>
                })}
            </select>
            {productImageURL ? <Image src={productImageURL} alt="product image" width={100} height={80}/> : <div></div>}
            <label htmlFor="include">Include</label>
            <input className={styles.ingredientCheckbox} type="checkbox" onClick={ToggleInclusion} defaultChecked={included || false}/>
        </li>
    )
}