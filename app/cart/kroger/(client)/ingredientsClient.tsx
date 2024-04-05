"use client";

import { useState, useEffect } from "react";
import type { MappedIngredients } from "@/types";
import Ingredient from "./ingredient";
import AddToKrogerCart from "@/app/actions/addToKrogerCart";
import { useRouter } from "next/navigation";


export default function IngredientsClient({mappedIngredients} : {mappedIngredients: MappedIngredients}) {

    type KPTA = {
        [ingrdientName: string]: {
            productId: string
            included: boolean
        }
    }
    const [krogerProductsToAddToCart, setKrogerProductsToAddToCart] = useState<KPTA>({});
    const [requireEmail, setRequireEmail] = useState(true);
    const [email, setEmail] = useState<string>();
    const [savePDF, setSavePDF] = useState(true);
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

        if (requireEmail && !email) {
            alert("Please enter an email, or uncheck to receive an email.");
            return;
        }

        const output = []
        for (const ingredientName in krogerProductsToAddToCart) {
            if (krogerProductsToAddToCart[ingredientName].included) {
                output.push(krogerProductsToAddToCart[ingredientName].productId);
            }
        }

        AddToKrogerCart(output, savePDF, email).then((res) => {
            if (res.success) {
                if (res.pdf) {
                    const link = document.createElement('a');
                    link.href = res.pdf;
                    link.download = "MTC Order.pdf";
                    link.click();
                }
                router.push("https://www.kroger.com/cart");
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
        <div className="column">
            <div className="row">
                <p style={{fontWeight: "600"}}>Email:</p>
                <input type="email" placeholder="YourEmail@example.com" onChange={(e) => setEmail(e.target.value)} value={email}/>
            </div>
            <div className="row">
                <input type="checkbox" checked={requireEmail} onChange={e => {setRequireEmail(!requireEmail)}}/>
                <p>Receive email with your recipes and shopping list.</p>
            </div>
            <div className="row">
                <input type="checkbox" checked={savePDF} onChange={e => {setSavePDF(!savePDF)}}/>
                <p>Save PDF with your recipes and shopping list.</p>
            </div>
        </div>
        
        
        <button onClick={AddToSmithsCart}>Add to Kroger Cart</button>
    </>
}