"use client";

import { Session } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";

type MealType = "main course" | "side dish" | "dessert" | "appetizer" | "salad" | "bread" | "breakfast" | "soup" | "beverage" | "sauce" | "marinade" | "fingerfood" | "snack" | "drink";
export default function RecipeSearch({session} : {session: Session | null}) {

    const router = useRouter();
    const searchParams = useSearchParams();
    const searchString = searchParams.get("searchString") || "";
    const mealType = searchParams.get("mealType") || "main course";
    const maxReadyTime = searchParams.get("maxReadyTime") || 30;

    function OnSubmit(formData : FormData) {
        const search = formData.get("search") || "";
        const mealType = formData.get("mealType") || "main course";
        const maxReadyTime = formData.get("maxReadyTime") || 30;
        const showFavorites = formData.get("showFavorites") || "";
        router.push(`?searchString=${search}&mealType=${mealType}&maxReadyTime=${maxReadyTime}&showFavorites=${showFavorites}`);
    }

    return (
        <form action={OnSubmit}>
            <label htmlFor="search"></label>
            <input type="text" name="search" id="search" placeholder="Search..." defaultValue={searchString}/>
            <label htmlFor="mealType">Meal Type</label>
            <select name="mealType" id="mealType" defaultValue={mealType}>
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
            <label htmlFor="maxReadyTime">Max Time to Prepare</label>
            {session && session.user ? <><label htmlFor="showFavorites">Favorites</label><input type="checkbox" name="showFavorites" id="showFavorites" value="true"/></> : <></>}
            <input type="number" name="maxReadyTime" id="maxReadyTime" placeholder="Max Ready Time..." defaultValue={maxReadyTime}/>
            <input type="submit" value="Search"></input>
        </form>
    );
}