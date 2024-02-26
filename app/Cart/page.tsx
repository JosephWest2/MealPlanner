import { cookies } from "next/headers";

export default async function Cart() {

    const cartCookie = cookies().get("cart");

    if (cartCookie === undefined) {
        return <p>Cart is empty</p>
    }

    const cart = JSON.parse(cartCookie.value);

    return (<>
        <h2>Recipes</h2>
        <h2>Ingredients</h2>
    </>)

}