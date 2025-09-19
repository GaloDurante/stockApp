'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface SaleContextType {
    totalPrice: number;
    shippingPrice: number | null;
    setTotalPrice: (value: number) => void;
    setShippingPrice: (value: number | null) => void;
}

const SaleContext = createContext<SaleContextType | undefined>(undefined);

export function SaleProvider({
    children,
    initialTotal,
    initialShipping,
}: {
    children: ReactNode;
    initialTotal: number;
    initialShipping: number | null;
}) {
    const [totalPrice, setTotalPrice] = useState(initialTotal);
    const [shippingPrice, setShippingPrice] = useState(initialShipping);

    return (
        <SaleContext.Provider value={{ totalPrice, shippingPrice, setTotalPrice, setShippingPrice }}>
            {children}
        </SaleContext.Provider>
    );
}

export function useSaleContext() {
    const ctx = useContext(SaleContext);
    if (!ctx) throw new Error('useSaleContext must be used within SaleProvider');
    return ctx;
}
