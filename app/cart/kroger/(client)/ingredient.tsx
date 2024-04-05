"use client";

import type { MappedIngredient } from "@/types";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/client/cartProvider/cartProvider";
import styles from "./krogerIngredient.module.css";
import Image from "next/image";

export default function Ingredient({mappedIngredient, UpdateSelectionCallback, ToggleInclusionCallback} : {mappedIngredient: MappedIngredient, UpdateSelectionCallback: (ingredientName: string, productId: string) => void, ToggleInclusionCallback: (ingredientName: string) => void}) {

    const {ToggleIngredientInclusion} = useContext(CartContext);
    const [selectedProductID, setSelectedProductID] = useState<string>(mappedIngredient.productOptions[0].productId);
    const [productImageURL, setProductImageURL] = useState<string | undefined>(mappedIngredient.productOptions[0].images.find(image => image.perspective == "front")?.sizes[0].url);
    const [included, setIncluded] = useState(mappedIngredient.cartIngredient.included);

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

    const recipeIngredeints = cartIngredient.recipeIngredients.map((ri, i) => {
        if (i === 0) {
            return ri.amount + " " + ri.unit
        } else {
            return " + " + ri.amount + " " + ri.unit
        }
    })

    return (
        <li className={styles.ingredientItem} data-included={included}>
            <p>{cartIngredient.name}</p>
            <p {...(mappedIngredient.cartIngredient.override && {style:{color: "steelblue"}})}>{mappedIngredient.cartIngredient.overrideValue || recipeIngredeints}</p>
            <select style={{maxWidth: "20rem"}} value={selectedProductID || ""} onChange={UpdateSelection}>
                {mappedIngredient.productOptions.map((product) => {
                    return <option key={product.productId} value={product.productId}>{product.description}</option>
                })}
            </select>
            {productImageURL ? <Image src={productImageURL} alt="product image" width={100} height={80}/> : <div></div>}
            <p>{mappedIngredient.productOptions.find(product => product.productId === selectedProductID)?.items[0].size}</p>
            <label htmlFor="include">Include</label>
            <input className={styles.ingredientCheckbox} type="checkbox" onClick={ToggleInclusion} defaultChecked={included || false}/>
        </li>
    )
}