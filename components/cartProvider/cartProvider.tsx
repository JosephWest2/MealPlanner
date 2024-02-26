"use client";

import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

export const CartContext = createContext({cart: null as any, setCart: null as any, addToCart: null as any});

export default function CartProvider({ children } : any) {
    const [cookies, setCookie] = useCookies(["cart"]);
    const [cart, setCart] = useState(cookies.cart);

    useEffect(() => {
        setCookie("cart", JSON.stringify(cart), {maxAge: 3600});
        console.log(cart);
    }, [cart])

    function addToCart(recipe: any) {
        
    }

    return (
        <CartContext.Provider value={{cart: cart, setCart: setCart, addToCart: }}>
            {children}
        </CartContext.Provider>
    );
}