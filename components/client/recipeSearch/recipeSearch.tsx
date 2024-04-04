"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import type { RecipeSearchParams, NutrientLimits } from "@/types";
import { EncodeNutrientLimits } from "@/lib/nutrientLimits";

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
} as any;

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
} as any;

export default function RecipeSearch() {

    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [query, setQuery] = useState("");
    const [mealType, setMealType] = useState("main course");
    const [cuisine, setCuisine] = useState("");
    const [diet, setDiet] = useState("");
    const [intolerances, setIntolerances] = useState<string[]>([]);
    const [maxReadyTime, setMaxReadyTime] = useState(90);
    const [nutrientLimits, setNutrientLimits] = useState<NutrientLimits>({});
    const [onlyFavorites, setOnlyFavorites] = useState(false);
    const [nutrientLimit, setNutrientLimit] = useState("minCarbs");
    const [nutrientLimitValue, setNutrientLimitValue] = useState<number | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const _query = searchParams.get("query");
        if (_query !== null) {
            setQuery(_query);
        }
        const _mealType = searchParams.get("mealType");
        if (_mealType !== null) {
            setMealType(_mealType);
        }
        const _cuisine = searchParams.get("cuisine");
        if (_cuisine !== null) {
            setCuisine(_cuisine);
        }
        const _diet = searchParams.get("diet");
        if (_diet !== null) {
            setDiet(_diet);
        }
        const _intolerances = searchParams.getAll("intolerances");
        if (_intolerances !== null) {
            setIntolerances(_intolerances);
        }
        const _maxReadyTime = searchParams.get("maxReadyTime");
        if (_maxReadyTime !== null) {
            setMaxReadyTime(Number(_maxReadyTime));
        }
        const _onlyFavorites = searchParams.get("onlyFavorites");
        if (_onlyFavorites !== null) {
            setOnlyFavorites(_onlyFavorites === "true");
        }
        let _nutrientLimits = null as NutrientLimits | null;
        searchParams.forEach((value, key) => {
            if (key.startsWith("min") || key.startsWith("max") && key !== "maxReadyTime") {
                if (_nutrientLimits === null) {
                    _nutrientLimits = {};
                }
                _nutrientLimits[key] = Number(value);
            }
        })
        if (_nutrientLimits !== null) {
            setNutrientLimits(_nutrientLimits);
        }
    }, []);

    function Search() {
        router.push(`/?query=${query}&mealType=${mealType}&maxReadyTime=${maxReadyTime}&onlyFavorites=${onlyFavorites}&intolerances=${intolerances.toString()}&diet=${diet}&cuisine=${cuisine}&nutrientLimits=${EncodeNutrientLimits(nutrientLimits)}`);
    }

    function AddNutrientLimit() {
        if (nutrientLimit && nutrientLimitValue) {
            const element = document.getElementById("nutrientLimitValue") as HTMLInputElement;
            if (element) {element.value = ""}
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

    function ToggleIntolerance(intolerance: string, checked: boolean) {
        if (checked) {
            setIntolerances([...intolerances, intolerance]);
        } else {
            setIntolerances(intolerances.filter(i => i !== intolerance));
        }
    }

    return (<div className="box column">
                <div className="row">
                    <input type="text" placeholder="Search..." style={{width: "100%"}} onChange={e => setQuery(e.target.value)} value={query}/>
                    <button onClick={Search}>Search</button>
                </div>
                <div className="column toggleable" data-enabled={showMoreOptions.toString()}>
                    <div className="optionsGrid">
                        <label htmlFor="mealType">Meal type</label>
                        <select onChange={(e) => setMealType(e.target.value)} id="mealType" value={mealType}>
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
                        <input id="maxReadyTime" onChange={(e) => setMaxReadyTime(Number(e.target.value))} type="number" placeholder="Max Ready Time..." value={maxReadyTime}/>
                        <label htmlFor="diet">Cuisine</label>
                        <select onChange={(e) => setCuisine(e.target.value)} id="cuisine" value={cuisine}>
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
                        <select onChange={(e) => setDiet(e.target.value)} id="diet" value={diet}>
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
                        <h4 className="subHeader" style={{marginBottom: "0.5rem"}}>Intolerances</h4>
                        <label htmlFor="dairy">Dairy</label>
                        <input type="checkbox" id="dairy" onChange={e => ToggleIntolerance("Dairy", e.target.checked)} value="Dairy" checked={intolerances.includes("Dairy")}/>
                        <label htmlFor="egg">Egg</label>
                        <input type="checkbox" id="egg" onChange={e => ToggleIntolerance("Egg", e.target.checked)} value="Egg" checked={intolerances.includes("Egg")}/>
                        <label htmlFor="gluten">Gluten</label>
                        <input type="checkbox" id="gluten" onChange={e => ToggleIntolerance("Gluten", e.target.checked)} value="Gluten" checked={intolerances.includes("Gluten")}/>
                        <label htmlFor="grain">Grain</label>
                        <input type="checkbox" id="grain" onChange={e => ToggleIntolerance("Grain", e.target.checked)} value="Grain" checked={intolerances.includes("Grain")}/>
                        <label htmlFor="peanut">Peanut</label>
                        <input type="checkbox" id="peanut" onChange={e => ToggleIntolerance("Peanut", e.target.checked)} value="Peanut" checked={intolerances.includes("Peanut")}/>
                        <label htmlFor="seafood">Seafood</label>
                        <input type="checkbox" id="seafood" onChange={e => ToggleIntolerance("Seafood", e.target.checked)} value="Seafood" checked={intolerances.includes("Seafood")}/>
                        <label htmlFor="sesame">Sesame</label>
                        <input type="checkbox" id="sesame" onChange={e => ToggleIntolerance("Sesame", e.target.checked)} value="Sesame" checked={intolerances.includes("Sesame")}/>
                        <label htmlFor="shellfish">Shellfish</label>
                        <input type="checkbox" id="shellfish" onChange={e => ToggleIntolerance("Shellfish", e.target.checked)} value="Shellfish" checked={intolerances.includes("Shellfish")}/>
                        <label htmlFor="soy">Soy</label>
                        <input type="checkbox" id="soy" onChange={e => ToggleIntolerance("Soy", e.target.checked)} value="Soy" checked={intolerances.includes("Soy")}/>
                        <label htmlFor="sulfite">Sulfite</label>
                        <input type="checkbox" id="sulfite" onChange={e => ToggleIntolerance("Sulfite", e.target.checked)} value="Sulfite" checked={intolerances.includes("Sulfite")}/>
                        <label htmlFor="tree-nut">Tree Nut</label>
                        <input type="checkbox" id="tree-nut" onChange={e => ToggleIntolerance("Tree Nut", e.target.checked)} value="Tree Nut" checked={intolerances.includes("Tree Nut")}/>
                        <label htmlFor="wheat">Wheat</label>
                        <input type="checkbox" id="wheat" onChange={e => ToggleIntolerance("Wheat", e.target.checked)} value="Wheat" checked={intolerances.includes("Wheat")}/>
                    </div>
                    <div className="row" style={{gap: "0", height: "2.2rem"}}>
                        <h4 style={{paddingRight: "1rem"}}>Nutrient Limits <span style={{color: "gray"}}>(per serving)</span></h4>
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
                        <input style={{borderRadius: "0", height: "100%"}} type="number" id="nutrientLimitValue" onChange={(e) => setNutrientLimitValue(Number(e.target.value))} />
                        <button style={{borderRadius: "0 0.5rem 0.5rem 0", height: "100%", borderLeft: "none", padding: "0 0.6rem"}} onClick={AddNutrientLimit}>Add</button>
                    </div>
                    <ul>
                        {Object.entries(nutrientLimits).map(([key, value]) => (
                            <li key={key}>{key}: {value}<button onClick={() => RemoveNutrientLimit(key)}>X</button></li>
                        ))}
                    </ul>
                </div>
                <button onClick={(e) => setShowMoreOptions(!showMoreOptions)}>{showMoreOptions ? "Less options" : "More options"}</button>
            </div>
    );
}