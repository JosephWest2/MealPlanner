"use client";

import type { MappedIngredient } from "@/types";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { CartContext } from "@/sharedComponents/cartProvider/cartProvider";
import styles from "./krogerIngredient.module.css";
import Image from "next/image";

export default function Ingredient({
    mappedIngredient,
    UpdateSelectionCallback,
    ToggleInclusionCallback,
}: {
    mappedIngredient: MappedIngredient;
    UpdateSelectionCallback: (
        ingredientName: string,
        productId: string
    ) => void;
    ToggleInclusionCallback: (ingredientName: string) => void;
}) {
    const cartIngredient = mappedIngredient.cartIngredient;

    const { ToggleIngredientInclusion } = useContext(CartContext);
    const [selectedProductID, setSelectedProductID] = useState<string | null>(
        mappedIngredient?.productOptions[0]?.productId || null
    );
    const [productImageURL, setProductImageURL] = useState<string | null>(
        mappedIngredient?.productOptions[0]?.images.find(
            (image) => image.perspective == "front"
        )?.sizes[0].url || null
    );
    const [included, setIncluded] = useState(
        mappedIngredient.cartIngredient.included
    );

    useEffect(() => {
        const product = mappedIngredient.productOptions?.find(
            (product) => product.productId === selectedProductID
        );
        if (!product) {
            return;
        }
        const url = product.images.find((image) => image.perspective == "front")
            ?.sizes[0].url;
        setProductImageURL(url || null);
    }, [selectedProductID]);

    function ToggleInclusion() {
        setIncluded(!included);
        ToggleInclusionCallback(cartIngredient.name);
        ToggleIngredientInclusion(cartIngredient.name);
    }

    function UpdateSelection(e: ChangeEvent<HTMLSelectElement>) {
        const newID = e.target.value;
        setSelectedProductID(newID);
        UpdateSelectionCallback(cartIngredient.name, newID);
    }

    const recipeIngredeints = cartIngredient.recipeIngredients.map((ri, i) => {
        if (i === 0) {
            return ri.amount + " " + ri.unit;
        } else {
            return " + " + ri.amount + " " + ri.unit;
        }
    });

    return (
        <li className={styles.ingredient} data-included={included}>
            <p className={styles.name}>{cartIngredient.name}</p>
            <p
                className={styles.amount}
                {...(mappedIngredient.cartIngredient.override && {
                    style: { color: "steelblue" },
                })}
            >
                {mappedIngredient.cartIngredient.overrideValue ||
                    recipeIngredeints}
            </p>
            {selectedProductID ? (
                <select
                    className={styles.options}
                    style={{ maxWidth: "20rem" }}
                    value={selectedProductID || ""}
                    onChange={UpdateSelection}
                >
                    {mappedIngredient.productOptions.map((product) => {
                        return (
                            <option
                                key={product.productId}
                                value={product.productId}
                            >
                                {product.description}
                            </option>
                        );
                    })}
                </select>
            ) : (
                <h4>Unable to find product</h4>
            )}
            {productImageURL ? (
                <Image
                    className={styles.image}
                    src={productImageURL}
                    alt="product image"
                    width={100}
                    height={80}
                />
            ) : (
                <div className={styles.image}></div>
            )}
            <p className={styles.selectedOptionSize}>
                {
                    mappedIngredient.productOptions?.find(
                        (product) => product.productId === selectedProductID
                    )?.items[0].size
                }
            </p>
            <input
                className={styles.checkbox}
                type="checkbox"
                onClick={ToggleInclusion}
                defaultChecked={included || false}
            />
        </li>
    );
}
