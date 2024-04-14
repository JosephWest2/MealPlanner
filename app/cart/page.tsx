"use client";

import styles from "./page.module.css";
import { CartContext } from "@/sharedComponents/cartProvider/cartProvider";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import type { CartRecipe, Cart } from "@/types";
import CartIngredients from "./(components)/cartIngredients";
import { SendPDF } from "@/app/actions/sendPDF";
import { GetPDF } from "@/app/actions/getPDF";

export default function Cart() {
    const [isClient, setIsClient] = useState(false);
    const [email, setEmail] = useState<string>();

    function _SendPDF() {
        if (email) {
            SendPDF(email);
            alert("Email Sent to " + email);
        } else {
            alert("Please enter your email.");
        }
    }

    function DownloadPDF() {
        GetPDF().then((res) => {
            if (res) {
                const link = document.createElement("a");
                link.href = res;
                link.download = "MTC Order.pdf";
                link.click();
            }
        });
    }

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { cart, RemoveRecipeFromCart } = useContext(CartContext);

    if (
        !cart ||
        !isClient ||
        cart.recipes.length == 0 ||
        !cart.ingredients ||
        Object.keys(cart.ingredients).length == 0
    ) {
        return (
            <div className="box column">
                <h2>Cart is Empty</h2>
                <Link className="btn" href="/">
                    Return to recipes
                </Link>
            </div>
        );
    }

    const _recipes = {} as {[id : string]: {recipe: CartRecipe, count : number}};
    cart.recipes.forEach((r) => {
        if (_recipes[r.id]) {
            _recipes[r.id].count++
        } else {
            _recipes[r.id] = {recipe: r, count: 1}
        }
    })
    return (
        <div className="column">
            <div className="column box">
                <h2>Recipes</h2>
                <ul className="column">
                    {Object.keys(_recipes).map((recipeId, _key) => {
                        const recipe = _recipes[recipeId].recipe;
                        return (<li
                            className={styles.recipeRow + " row no-wrap"}
                            key={_key}
                        >
                            <Link href={`/recipes/${recipe.id}`}>
                                • {recipe.name}
                            </Link>{" "}
                            {_recipes[recipeId].count > 1 ? <p>x{_recipes[recipeId].count}</p> : <></>}
                            <button
                                className={styles.remove}
                                onClick={() => RemoveRecipeFromCart(recipe)}
                            >
                                remove
                            </button>
                        </li>)
                    })}
                </ul>
            </div>
            <CartIngredients></CartIngredients>
            <div className={styles.buttonContainer}>
                <Link className="btn" href="/cart/kroger">
                    Continue with Kroger
                </Link>
                <div className={styles.underline}></div>
                <button onClick={DownloadPDF}>Download list and recipes</button>
                <div className="conjoinedContainer">
                    <input
                        className="conjoinedLeft"
                        type="email"
                        placeholder="YourEmail@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        className="conjoinedRight"
                        style={{ width: "100%" }}
                        onClick={_SendPDF}
                    >
                        Email list and recipes
                    </button>
                </div>
            </div>
        </div>
    );
}
