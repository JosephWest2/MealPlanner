"use client";

import { CartContext } from "@/components/client/cartProvider/cartProvider";
import { useContext, useState, useEffect } from "react";
import getNearestKrogerStore from "@/app/actions/getNearestKrogerStore";
import GetSmithsAccessToken from "@/app/actions/smithsAccessToken";
import Link from "next/link";
import styles from "./page.module.css"
import type { CartRecipe, Cart } from "@/types";

export default function Cart() {

    const [isClient, setIsClient] = useState(false);
    const [location, setLocation] = useState<GeolocationCoordinates | undefined>(undefined);
    const [zipCode, setZipCode] = useState<number | undefined>(undefined);
    const [nearestStore, setNearestStore] = useState<any>(null);
    const [clientKrogerId, setClientKrogerId] = useState<string | undefined>(undefined);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!location && !zipCode || !location && !(zipCode?.toString().length == 5)) {return;}
        getNearestKrogerStore(location?.latitude, location?.longitude, zipCode).then(data => {
            setNearestStore(data[0]);
        });
    }, [location, zipCode])

    const {cart, ToggleIngredientInclusion, RemoveRecipeFromCart, OverrideIngredient, CancelIngredientOverride} = useContext(CartContext);

    if (!cart || !isClient || cart.recipes.length == 0 || !cart.ingredients || Object.keys(cart.ingredients).length == 0) {
        return <div className="box column">
            <h2>Cart is Empty</h2>
            <Link className="btn" href="/">Return to recipes</Link>
        </div>
    }

    function GetLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation(position.coords);
        }, () => {
            alert("Failed to get location")
        })
    }

    const ingredients = cart.ingredients;

    return (<div className="column">
        <div className="column box">
            <h2>Recipes</h2>
            <ul className="column">
                {cart.recipes.map((recipe: CartRecipe, _key: number) => (
                    <li className="row" key={_key}><p>• {recipe.name}</p><Link className="btn" href={`/recipes/${recipe.id}`}>View Recipe</Link> <button onClick={() => RemoveRecipeFromCart(recipe)}>Remove</button></li>
                ))}
            </ul>
        </div>
        <div className="column box">
            <h2>Ingredients</h2>
            <ol className="column">
                {Object.keys(ingredients).map((ingredientName: string, _key: number) => {

                    const ingredient = ingredients[ingredientName];
                    let amount = <span>{ingredient.totalAmount}</span>
                    if (ingredient.override) {
                        amount = <span style={{color: "red"}}>{ingredient.overrideValue}</span>
                    }

                    function FormAction (formData : FormData) {
                        const amount = formData.get("amount");
                        if (amount) {
                            OverrideIngredient(ingredientName, amount);
                        } else {
                            CancelIngredientOverride(ingredientName);
                        }
                        const element = document.getElementById("amount" + _key) as HTMLInputElement;
                        if (element) {
                            element.value = "";
                        }
                    }

                    let overrideAmountInput;
                    if (ingredient.override) {
                        overrideAmountInput = <input className={styles.ingredientOverrideInput} id={"amount" + _key} name="amount" type="number" min="0" data-enabled="false" disabled/>
                    } else {
                        overrideAmountInput = <input className={styles.ingredientOverrideInput} id={"amount" + _key} name="amount" type="number" min="0" />
                    }

                    return (
                    <li className={styles.ingredientItem} data-included={ingredient.included} key={_key}>
                        <p>{ingredientName} {amount} {ingredient.unit}</p>
                        <form className={styles.ingredientOverrideForm} action={FormAction}>
                            {overrideAmountInput}
                            <input className={styles.ingredientOverrideSubmit} data-override={ingredient.override} type="submit" value={ingredient.override ? "Cancel" : "Override"} />
                        </form>
                        <label htmlFor="include">Include</label>
                        <input className={styles.ingredientCheckbox} name="include" id="include" type="checkbox" onClick={() => ToggleIngredientInclusion(ingredientName)} defaultChecked={ingredients[ingredientName].included}/>
                    </li>
                    )
                })}
            </ol>
        </div>
        <div className="box column">
            <div className="row">
                <label htmlFor="zipCode">Zip Code</label>
                <input type="number" id="zipCode" name="zipCode" onChange={(e) => setZipCode(Number(e.target.value))} />
                <p>or</p>
                <button onClick={GetLocation}>Get Location</button>
            </div>
            
            <p>Location: {location?.latitude} {location?.longitude}</p>
            <p>Zip Code: {zipCode}</p>
            <p>Nearest Store: {nearestStore?.name}</p>

            <button onClick={() => {
                GetSmithsAccessToken().then(token => {
                    console.log(token);
                    fetch("https:/api-ce.kroger.com/v1/identity/profile", {
                        method: "GET",
                        mode: "no-cors",
                        headers: {
                            "Accept": "application/json",
                            "Authorization": token
                        }
                    }).then(response => response.json()).then(data => console.log(data)).catch(e => console.log(e));
                })
                
            }}>authorize</button>

            <Link className="btn" href="/cart/kroger">Add to Kroger cart</Link>
        </div>

        
        
    </div>)

}