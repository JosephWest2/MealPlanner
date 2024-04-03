"use client";

import { useState, useEffect, useContext } from "react";
import type { MappedIngredients } from "@/types";
import Ingredient from "./ingredient";
import AddToKrogerCart from "@/app/actions/addToKrogerCart";
import { useRouter } from "next/navigation";
import { CartContext } from "@/components/client/cartProvider/cartProvider";


export default function IngredientsClient({mappedIngredients} : {mappedIngredients: MappedIngredients}) {

    const {cart} = useContext(CartContext);
    type KPTA = {
        [ingrdientName: string]: {
            productId: string
            included: boolean
        }
    }
    const [krogerProductsToAddToCart, setKrogerProductsToAddToCart] = useState<KPTA>({});
    const router = useRouter();

    useEffect(() => {
        const init = {} as KPTA;
        for (const key in mappedIngredients) {
            if (mappedIngredients[key].cartIngredient.included) {
                init[key] = {productId: mappedIngredients[key].productOptions[0].productId, included: true};
            }
        }
        setKrogerProductsToAddToCart(init);
    }, [mappedIngredients]);

    function UpdateProdudctSelection(ingredientName: string, productId: string) {
        const _krogerProductIdsToAddToCart = {...krogerProductsToAddToCart};
        if (krogerProductsToAddToCart[ingredientName]) {
            _krogerProductIdsToAddToCart[ingredientName].productId = productId;
        } else {
            _krogerProductIdsToAddToCart[ingredientName] = {productId: productId, included: true};
        }
        setKrogerProductsToAddToCart(_krogerProductIdsToAddToCart);
    }

    function ToggleInclusion(ingredientName: string) {
        const _krogerProductIdsToAddToCart = {...krogerProductsToAddToCart};
        _krogerProductIdsToAddToCart[ingredientName].included = !_krogerProductIdsToAddToCart[ingredientName].included;
        setKrogerProductsToAddToCart(_krogerProductIdsToAddToCart);
    }

    
    function AddToSmithsCart() {

        const output = []
        for (const ingredientName in krogerProductsToAddToCart) {
            if (krogerProductsToAddToCart[ingredientName].included) {
                output.push(krogerProductsToAddToCart[ingredientName].productId);
            }
        }

        AddToKrogerCart(output).then((res) => {
            if (res.success) {
                console.log(res.pdf);
                if (res.pdf) {
                    const link = document.createElement('a');
                    link.href = res.pdf;
                    link.download = "MTC Order.pdf";
                    link.click();
                }
                // router.push("https://www.kroger.com/cart");
            } else {
                alert("failed to add to cart");
            }
        });
    }

    return <>
        <ol className="column">
            {Object.keys(mappedIngredients).map((key) => {
                const ingredient = mappedIngredients[key];
                return <Ingredient key={key} mappedIngredient={ingredient} UpdateSelectionCallback={UpdateProdudctSelection} ToggleInclusionCallback={ToggleInclusion}></Ingredient>
            })}
        </ol>
        <button onClick={AddToSmithsCart}>Add to Kroger Cart</button>
        <button>Generate PDF</button>
    </>
}