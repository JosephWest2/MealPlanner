"use client";

import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import CartProvider from "@/sharedComponents/client/cartProvider/cartProvider";

type Props = {
    children?: React.ReactNode;
};

export const Providers = ({ children }: Props) => {
    const router = useRouter();

    return (
        <SessionProvider>
            <CartProvider>{children}</CartProvider>
        </SessionProvider>
    );
};
