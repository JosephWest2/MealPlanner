"use client";

import CartProvider from "@/sharedComponents/cartProvider/cartProvider";
import SessionProvider from "@/sharedComponents/sessionProvider/sessionProvider";

type Props = {
    children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
    return (
        <SessionProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </SessionProvider>
    );
};
