"use client";

import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./recipeSearch.module.css";

export const optionMapping = {
    minCarbs: 'min Carbs',
    maxCarbs: 'max Carbs',
    minProtein: 'min Protein',
    maxProtein: 'max Protein',
    minFat: 'min Fat',
    maxFat: 'max Fat',
    minCalories: 'min Calories',
    maxCalories: 'max Calories',
    minSodium: 'min Sodium',
    maxSodium: 'max Sodium',
    minSugar: 'min Sugar',
    maxSugar: 'max Sugar',
    minCholesterol: 'min Cholesterol',
    maxCholesterol: 'max Cholesterol',
    minCaffeine: 'min Caffeine',
    maxCaffeine: 'max Caffeine',
    minSaturatedFat: 'min Saturated Fat',
    maxSaturatedFat: 'max Saturated Fat',
    minFiber: 'min Fiber',
    maxFiber: 'max Fiber',
    minAlcohol: 'min Alcohol',
    maxAlcohol: 'max Alcohol'
};

export const unitMapping = {
    minCarbs: 'g',
    maxCarbs: 'g',
    minProtein: 'g',
    maxProtein: 'g',
    minFat: 'g',
    maxFat: 'g',
    minCalories: '',
    maxCalories: '',
    minSodium: 'mg',
    maxSodium: 'mg',
    minSugar: 'g',
    maxSugar: 'g',
    minCholesterol: 'mg',
    maxCholesterol: 'mg',
    minCaffeine: 'mg',
    maxCaffeine: 'mg',
    minSaturatedFat: 'g',
    maxSaturatedFat: 'g',
    minFiber: 'g',
    maxFiber: 'g',
    minAlcohol: 'g',
    maxAlcohol: 'g'
};

export default function RecipeSearch({session} : {session: Session | null}) {

    const [showOptions, setShowOptions] = useState(false);
    const [nutrientLimits, setNutrientLimits] = useState({});

    const [query, setQuery] = useState("");
    const [mealTypes, setMealTypes] = useState("");
    const [maxReadyTimes, setMaxReadyTimes] = useState(30);
    const [cuisine, setCuisine] = useState("");
    const [diet, setDiet] = useState("");
    const [intolerances, setIntolerances] = useState([]);
    const [showFavorites, setShowFavorites] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const searchString = searchParams.get("searchString") || "";
    const mealType = searchParams.get("mealType") || "main course";
    const maxReadyTime = searchParams.get("maxReadyTime") || 30;

    useEffect(() => {
        let _nutrientLimits = {...nutrientLimits};
        searchParams.forEach((value, key) => {
            if (key.startsWith("min") || key.startsWith("max") && key !== "maxReadyTime") {
                _nutrientLimits[key] = value;
            }
        })
        setNutrientLimits(_nutrientLimits);
    }, []);
    

    function OnSubmit(formData : FormData) {
        const search = formData.get("search") || "";
        const mealType = formData.get("mealType") || "main course";
        const maxReadyTime = formData.get("maxReadyTime") || 30;
        const showFavorites = formData.get("showFavorites") || "";
        const cuisine = formData.get("cuisine") || "";
        const diet = formData.get("diet") || "";
        const intolerances = formData.getAll("intolerances");

        let nutrientLimitString = "";
        for (const [key, value] of Object.entries(nutrientLimits)) {
            nutrientLimitString += `&${key}=${value}`;
        }
        router.push(`/?searchString=${search}&mealType=${mealType}&maxReadyTime=${maxReadyTime}&showFavorites=${showFavorites}&intolerances=${intolerances.toString()}&diet=${diet}&cuisine=${cuisine}${nutrientLimitString}`);
    }

    function ToggleOptions() {
        setShowOptions(!showOptions);
    }

    function LoggedInContent() {
        if (session && session.user) {
            return <div className={styles.favoriteContainer}>
                    <label htmlFor="showFavorites">Favorites only</label>
                    <input className={styles.showFavorites} type="checkbox" name="showFavorites" id="showFavorites" value="true"/>
                </div>
        }
        return <></>
    }

    
    function AddNutrientLimit(formData: FormData) {
        const limitName = formData.get("nutrientLimitName");
        const limitValue = formData.get("nutrientLimitValue");
        if (limitName && limitValue) {
            const doc = document as any;
            doc.getElementById("nutrientLimitValue").value = "";
            let _nutrientLimits = {...nutrientLimits};

            _nutrientLimits[optionMapping[limitName.toString()]] = limitValue + unitMapping[limitName.toString()];
            setNutrientLimits(_nutrientLimits);
        }
    }

    function RemoveNutrientLimit(key: string) {
        let _nutrientLimits = {...nutrientLimits};
        delete _nutrientLimits[key];
        setNutrientLimits(_nutrientLimits);
    }


    return (<div className={styles.recipeSearchContainer}>
                <form className={styles.searchForm} action={OnSubmit}>
                    <div className={styles.row}>
                        <input className={styles.mainSearch}  type="text" name="search" id="search" placeholder="Search..." defaultValue={searchString}/>
                        <input className={styles.submit} type="submit" value="Search"></input>
                        {LoggedInContent()}
                    </div>
                    <div className={styles.column} style={{display: showOptions ? "flex" : "none"}}>
                        <div className={styles.inputSet}>
                            <label htmlFor="mealType">Meal type</label>
                            <select className={styles.select} name="mealType" id="mealType" defaultValue={mealType}>
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
                        </div>
                        <div className={styles.inputSet}>
                            <label htmlFor="diet">Cuisine</label>
                            <select className={styles.select} name="cuisine" id="cuisine">
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
                        </div>
                        <div className={styles.inputSet}>
                            <label htmlFor="diet">Diet type</label>
                            <select className={styles.select} name="diet" id="diet">
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
                        <div className={styles.intolerances}>
                            <h4 className={styles.intolerancesHeader}>Intolerances</h4>
                            <label htmlFor="dairy">Dairy</label>
                            <input type="checkbox" id="dairy" name="intolerances" value="Dairy"/>
                            <label htmlFor="egg">Egg</label>
                            <input type="checkbox" id="egg" name="intolerances" value="Egg"/>
                            <label htmlFor="gluten">Gluten</label>
                            <input type="checkbox" id="gluten" name="intolerances" value="Gluten"/>
                            <label htmlFor="grain">Grain</label>
                            <input type="checkbox" id="grain" name="intolerances" value="Grain"/>
                            <label htmlFor="peanut">Peanut</label>
                            <input type="checkbox" id="peanut" name="intolerances" value="Peanut"/>
                            <label htmlFor="seafood">Seafood</label>
                            <input type="checkbox" id="seafood" name="intolerances" value="Seafood"/>
                            <label htmlFor="sesame">Sesame</label>
                            <input type="checkbox" id="sesame" name="intolerances" value="Sesame"/>
                            <label htmlFor="shellfish">Shellfish</label>
                            <input type="checkbox" id="shellfish" name="intolerances" value="Shellfish"/>
                            <label htmlFor="soy">Soy</label>
                            <input type="checkbox" id="soy" name="intolerances" value="Soy"/>
                            <label htmlFor="sulfite">Sulfite</label>
                            <input type="checkbox" id="sulfite" name="intolerances" value="Sulfite"/>
                            <label htmlFor="tree-nut">Tree Nut</label>
                            <input type="checkbox" id="tree-nut" name="intolerances" value="Tree Nut"/>
                            <label htmlFor="wheat">Wheat</label>
                            <input type="checkbox" id="wheat" name="intolerances" value="Wheat"/>
                        </div>
                        <div className={styles.inputSet}>
                            <label htmlFor="maxReadyTime">Max time to prepare (minutes)</label>
                            <input className={styles.numberInput} type="number" name="maxReadyTime" id="maxReadyTime" placeholder="Max Ready Time..." defaultValue={maxReadyTime}/>
                        </div>
                    </div>
                </form>
                <form action={AddNutrientLimit} className={styles.nutrientLimits}>
                    <h4 className={styles.nutrientLimitsHeader}>Nutrient Limits <span className={styles.units}>(per serving)</span></h4>
                    <select className={styles.leftInput} name="nutrientLimitName" id="nutrientLimitName">
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
                    <input type="number" name="nutrientLimitValue" id="nutrientLimitValue" className={styles.numberInput + " " + styles.middleInput} />
                    <input type="submit" value="Add" className={styles.rightInput}/>
                </form>
                <ul style={{display: showOptions ? "" : "none"}} className={styles.nutrientLimitsList}>
                    {Object.entries(nutrientLimits).map(([key, value]) => (
                        <li key={key}>{key}: {value as string}<button onClick={() => RemoveNutrientLimit(key)} className={styles.nutrientRemoveButton}>X</button></li>
                    ))}
                </ul>
                <button className={styles.toggleOptionsButton} onClick={ToggleOptions}>{showOptions ? "less options" : "more options"}</button>
            </div>
    );
}

function FORM() {
    return (
        <div className={styles.column}>

        </div>
    )
}