"use client";

import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import CartProvider from "@/components/client/cartProvider/cartProvider";
import { Component } from "react";

type Props = {
    children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {

    const router = useRouter();

    return  <SessionProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </SessionProvider>
};