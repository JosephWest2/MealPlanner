"use client";

import { SessionProvider } from "next-auth/react";
import CartProvider from "@/components/client/cartProvider/cartProvider";

type Props = {
    children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
    return <SessionProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </SessionProvider>;
};