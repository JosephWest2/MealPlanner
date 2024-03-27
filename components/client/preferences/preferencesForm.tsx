"use client";

import styles from "./preferencesForm.module.css";
import { useState } from "react";
import { optionMapping, unitMapping } from "@/components/client/recipeSearch/recipeSearch";
import { Session } from "next-auth";
import SavePreferences from "@/app/actions/savePreferences";
import { redirect } from "next/navigation";
import type { RecipeSearchParams } from "@/types";

export default function PreferencesForm({session, initialPreferences} : {session: Session | null, initialPreferences: RecipeSearchParams}) {

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }

    const [nutrientLimits, setNutrientLimits] = useState(initialPreferences.nutrientLimits);
    const [readyTime, setReadyTime] = useState(initialPreferences.maxReadyTime);
    const [mealType, setMealType] = useState(initialPreferences.mealType);
    const [cuisine, setCuisine] = useState(initialPreferences.cuisine);
    const [diet, setDiet] = useState(initialPreferences.diet);
    const [intolerances, setIntolerances] = useState(initialPreferences.intolerances);

    const [nutrientLimit, setNutrientLimit] = useState("minCarbs" as string | null);
    const [nutrientLimitValue, setNutrientLimitValue] = useState(null as number | null);

    async function SavePreferencesLocal() {
        if (session && session.user) {
            const result = await SavePreferences({
                diet: diet,
                mealType: mealType,
                intolerances: intolerances,
                cuisine: cuisine,
                maxReadyTime: readyTime,
                nutrientLimits: nutrientLimits
            });
            if (result.success) {
                alert("Preferences Saved");
            } else {
                alert("Error saving preferences");
            }
        } else {
            redirect("/api/auth/signin");
        }
    }

    function AddNutrientLimit() {
        if (nutrientLimit && nutrientLimitValue) {
            const element = document.getElementById("nutrientLimitValue") as HTMLInputElement;
            if (element) { element.value = "" }
            let _nutrientLimits = {...nutrientLimits};

            _nutrientLimits[optionMapping[nutrientLimit.toString()]] = nutrientLimitValue + unitMapping[nutrientLimit.toString()];
            setNutrientLimits(_nutrientLimits);
            setNutrientLimitValue(null);
        }
    }
    function RemoveNutrientLimit(key: string) {
        let _nutrientLimits = {...nutrientLimits};
        delete _nutrientLimits[key];
        setNutrientLimits(_nutrientLimits);
    }
    function SetIntolerance(intolerance: string, checked: boolean) {
        let _intolerances = [...intolerances];
        if (checked) {
            _intolerances.push(intolerance);
        } else {
            let i = 0;
            while (i < _intolerances.length) {
                if (_intolerances[i] === intolerance && !checked) {
                    _intolerances.splice(i, 1);
                } else {
                    i++;
                }
            }
        }
        console.log(_intolerances);
        
        setIntolerances(_intolerances);

    }

    return (
        <>
            <div className="optionsGrid">
                    <label htmlFor="mealType">Meal type</label>
                    <select name="mealType" id="mealType" defaultValue={mealType?.toString()} onChange={(e) => setMealType(e.target.value)}>
                        <option value="main course">Main Course</option>
                        <option value="side dish">Side Dish</option>
                        <option value="dessert">Dessert</option>
                        <option value="appetizer">Appetizer</option>
                        <option value="salad">Salad</option>
                        <option value="bread">Bread</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="soup">Soup</option>
                        <option value="beverage">Beverage</option>
                        <option value="sauce">Sauce</option>
                        <option value="marinade">Marinade</option>
                        <option value="fingerfood">Fingerfood</option>
                        <option value="snack">Snack</option>
                        <option value="drink">Drink</option>
                    </select>
                    <label htmlFor="maxReadyTime">Max time to prepare (minutes)</label>
                    <input type="number" name="maxReadyTime" id="maxReadyTime" placeholder="Max Ready Time..." defaultValue={readyTime?.toString()} onChange={(e) => setReadyTime(Number(e.target.value))}/> 
                    <label htmlFor="diet">Cuisine</label>
                    <select name="cuisine" id="cuisine" defaultValue={cuisine?.toString()} onChange={(e) => setCuisine(e.target.value)}>
                        <option value="">N/A</option>
                        <option value="African">African</option>
                        <option value="Asian">Asian</option>
                        <option value="American">American</option>
                        <option value="British">British</option>
                        <option value="Cajun">Cajun</option>
                        <option value="Caribbean">Caribbean</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Eastern European">Eastern European</option>
                        <option value="European">European</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Greek">Greek</option>
                        <option value="Indian">Indian</option>
                        <option value="Irish">Irish</option>
                        <option value="Italian">Italian</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Jewish">Jewish</option>
                        <option value="Korean">Korean</option>
                        <option value="Latin American">Latin American</option>
                        <option value="Mediterranean">Mediterranean</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Middle Eastern">Middle Eastern</option>
                        <option value="Nordic">Nordic</option>
                        <option value="Southern">Southern</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Thai">Thai</option>
                        <option value="Vietnamese">Vietnamese</option>
                    </select>
                    <label htmlFor="diet">Diet type</label>
                    <select name="diet" id="diet" defaultValue={diet?.toString()} onChange={(e) => setDiet(e.target.value)}>
                        <option value="">N/A</option>
                        <option value="Gluten Free">Gluten free</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Ketogenic">Ketogenic</option>
                        <option value="Pescetarian">Pescetarian</option>
                        <option value="Paleo">Paleo</option>
                        <option value="Primal">Primal</option>
                        <option value="Low FODMAP">Low FODMAP</option>
                        <option value="Lacto-Vegetarian">Lacto-vegetarian</option>
                        <option value="Ovo-Vegetarian">Ovo-vegetarian</option>
                        <option value="Whole30">Whole30</option>
                    </select>
            </div>
            <div className="intolerances">
                <h4 className="subHeader">Intolerances</h4>
                <label htmlFor="dairy">Dairy</label>
                <input type="checkbox" id="dairy" name="intolerances" value="Dairy" defaultChecked={intolerances?.includes("Dairy")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="egg">Egg</label>
                <input type="checkbox" id="egg" name="intolerances" value="Egg" defaultChecked={intolerances?.includes("Egg")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="gluten">Gluten</label>
                <input type="checkbox" id="gluten" name="intolerances" value="Gluten" defaultChecked={intolerances?.includes("Gluten")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="grain">Grain</label>
                <input type="checkbox" id="grain" name="intolerances" value="Grain" defaultChecked={intolerances?.includes("Grain")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="peanut">Peanut</label>
                <input type="checkbox" id="peanut" name="intolerances" value="Peanut" defaultChecked={intolerances?.includes("Peanut")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="seafood">Seafood</label>
                <input type="checkbox" id="seafood" name="intolerances" value="Seafood" defaultChecked={intolerances?.includes("Seafood")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="sesame">Sesame</label>
                <input type="checkbox" id="sesame" name="intolerances" value="Sesame" defaultChecked={intolerances?.includes("Sesame")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="shellfish">Shellfish</label>
                <input type="checkbox" id="shellfish" name="intolerances" value="Shellfish" defaultChecked={intolerances?.includes("Shellfish")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="soy">Soy</label>
                <input type="checkbox" id="soy" name="intolerances" value="Soy" defaultChecked={intolerances?.includes("Soy")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="sulfite">Sulfite</label>
                <input type="checkbox" id="sulfite" name="intolerances" value="Sulfite" defaultChecked={intolerances?.includes("Sulfite")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="tree-nut">Tree Nut</label>
                <input type="checkbox" id="tree-nut" name="intolerances" value="Tree Nut" defaultChecked={intolerances?.includes("Tree Nut")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
                <label htmlFor="wheat">Wheat</label>
                <input type="checkbox" id="wheat" name="intolerances" value="Wheat" defaultChecked={intolerances?.includes("Wheat")} onChange={(e) => SetIntolerance(e.target.value, e.target.checked)}/>
            </div>
            <div className="row" style={{gap: "0", height: "2.2rem"}}>
                <h4 style={{paddingRight: "1rem"}}>Nutrient Limits <span style={{color: "grey"}}>(per serving)</span></h4>
                <select style={{borderRadius: "0.5rem 0 0 0.5rem", height: "100%", borderRight: "none"}} id="nutrientLimit" onChange={(e) => setNutrientLimit(e.target.value)}>
                    <option value="minCarbs">min Carbs (g)</option>
                    <option value="maxCarbs">max Carbs (g)</option>
                    <option value="minProtein">min Protein (g)</option>
                    <option value="maxProtein">max Protein (g)</option>
                    <option value="minFat">min Fat (g)</option>
                    <option value="maxFat">max Fat (g)</option>
                    <option value="minCalories">min Calories</option>
                    <option value="maxCalories">max Calories</option>
                    <option value="minSodium">min Sodium (mg)</option>
                    <option value="maxSodium">max Sodium (mg)</option>
                    <option value="minSugar">min Sugar (g)</option>
                    <option value="maxSugar">max Sugar (g)</option>
                    <option value="minCholesterol">min Cholesterol (mg)</option>
                    <option value="maxCholesterol">max Cholesterol (mg)</option>
                    <option value="minCaffeine">min Caffeine (mg)</option>
                    <option value="maxCaffeine">max Caffeine (mg)</option>
                    <option value="minSaturatedFat">min Saturated Fat (g)</option>
                    <option value="maxSaturatedFat">max Saturated Fat (g)</option>
                    <option value="minFiber">min Fiber (g)</option>
                    <option value="maxFiber">max Fiber (g)</option>
                    <option value="minAlcohol">min Alcohol (g)</option>
                    <option value="maxAlcohol">max Alcohol (g)</option>
                </select>
                <input style={{borderRadius: "0", height: "100%"}} type="number" id="nutrientLimitValue" onChange={(e) => {setNutrientLimitValue(Number(e.target.value))}} />
                <button style={{borderRadius: "0 0.5rem 0.5rem 0", height: "100%", borderLeft: "none", padding: "0 0.6rem"}} onClick={AddNutrientLimit}>Add</button>
            </div>
            <ul>
                {nutrientLimits ? Object.entries(nutrientLimits).map(([key, value]) => (
                    <li key={key}>{key}: {value}<button onClick={() => RemoveNutrientLimit(key)} >X</button></li>
                )) : null}
            </ul>
            <button onClick={SavePreferencesLocal}>Save</button>
        </>
        
    );
}