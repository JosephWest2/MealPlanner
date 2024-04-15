"use client";

import { useState, useEffect, useContext } from "react";
import type { MappedIngredient } from "@/types";
import KrogerIngredient from "./krogerIngredient";
import AddToKrogerCart from "@/app/actions/addToKrogerCart";
import { useRouter } from "next/navigation";
import { CartContext } from "@/sharedComponents/cartProvider/cartProvider";

export default function KrogerIngredientsClient({
    mappedIngredients,
}: {
    mappedIngredients: MappedIngredient[];
}) {
    type KPTA = {
        [ingrdientName: string]: {
            productId: string;
            included: boolean;
        };
    };
    const {cart} = useContext(CartContext);

    const [krogerProductsToAddToCart, setKrogerProductsToAddToCart] =
        useState<KPTA>({});
    const [requireEmail, setRequireEmail] = useState(true);
    const [email, setEmail] = useState<string>();
    const [savePDF, setSavePDF] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const init = {} as KPTA;
        for (let i = 0; i < mappedIngredients.length; i++) {
            const mi = mappedIngredients[i];
            if (
                mi.included &&
                mi.productOptions &&
                mi.productOptions.length > 0 &&
                mi.productOptions[0].productId
            ) {
                init[mi.name] = {
                    productId: mi.productOptions[0].productId,
                    included: true,
                };
            }
        }
        setKrogerProductsToAddToCart(init);
    }, [mappedIngredients]);

    function UpdateProdudctSelection(
        ingredientName: string,
        productId: string
    ) {
        const _krogerProductIdsToAddToCart = { ...krogerProductsToAddToCart };
        if (krogerProductsToAddToCart[ingredientName]) {
            _krogerProductIdsToAddToCart[ingredientName].productId = productId;
        } else {
            _krogerProductIdsToAddToCart[ingredientName] = {
                productId: productId,
                included: true,
            };
        }
        setKrogerProductsToAddToCart(_krogerProductIdsToAddToCart);
    }

    function ToggleInclusion(ingredientName: string) {
        const _krogerProductIdsToAddToCart = { ...krogerProductsToAddToCart };
        _krogerProductIdsToAddToCart[ingredientName].included =
            !_krogerProductIdsToAddToCart[ingredientName].included;
        setKrogerProductsToAddToCart(_krogerProductIdsToAddToCart);
    }

    function AddToSmithsCart() {
        if (requireEmail && !email) {
            alert("Please enter an email, or uncheck to receive an email.");
            return;
        }

        const output = [];
        for (const ingredientName in krogerProductsToAddToCart) {
            if (krogerProductsToAddToCart[ingredientName].included) {
                output.push(
                    krogerProductsToAddToCart[ingredientName].productId
                );
            }
        }

        if (!cart) {
            alert("cart empty or not found.");
            return;
        }

        AddToKrogerCart(output, savePDF, cart, email).then((res) => {
            if (res.success) {
                if (res.pdf) {
                    const link = document.createElement("a");
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

    mappedIngredients.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    return (
        <>
            <ol className="column">
                {mappedIngredients.map((mi) => {
                    return (
                        <KrogerIngredient
                            key={mi.name}
                            mappedIngredient={mi}
                            UpdateSelectionCallback={UpdateProdudctSelection}
                            ToggleInclusionCallback={ToggleInclusion}
                        ></KrogerIngredient>
                    );
                })}
            </ol>
            <div className="column">
                <div className="row">
                    <p style={{ fontWeight: "600" }}>Email:</p>
                    <input
                        type="email"
                        placeholder="YourEmail@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className="row">
                    <input
                        type="checkbox"
                        checked={requireEmail}
                        onChange={(e) => {
                            setRequireEmail(!requireEmail);
                        }}
                    />
                    <p>Receive email with your recipes and shopping list.</p>
                </div>
                <div className="row">
                    <input
                        type="checkbox"
                        checked={savePDF}
                        onChange={(e) => {
                            setSavePDF(!savePDF);
                        }}
                    />
                    <p>Save PDF with your recipes and shopping list.</p>
                </div>
            </div>

            <button onClick={AddToSmithsCart}>Add to Kroger Cart</button>
        </>
    );
}
