'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface SaleContextType {
    totalPrice: number;
    shippingPrice: number | null;
    supplierCoveredAmount: number | null;
    setTotalPrice: (value: number) => void;
    setShippingPrice: (value: number | null) => void;
    setSupplierCoveredAmount: (value: number | null) => void;
}

const SaleContext = createContext<SaleContextType | undefined>(undefined);

export function SaleProvider({
    children,
    initialTotal,
    initialShipping,
    initialSupplierCoveredAmount,
}: {
    children: ReactNode;
    initialTotal: number;
    initialShipping: number | null;
    initialSupplierCoveredAmount: number | null;
}) {
    const [totalPrice, setTotalPrice] = useState(initialTotal);
    const [shippingPrice, setShippingPrice] = useState(initialShipping);
    const [supplierCoveredAmount, setSupplierCoveredAmount] = useState(initialSupplierCoveredAmount);

    return (
        <SaleContext.Provider
            value={{
                totalPrice,
                shippingPrice,
                supplierCoveredAmount,
                setTotalPrice,
                setShippingPrice,
                setSupplierCoveredAmount,
            }}
        >
            {children}
        </SaleContext.Provider>
    );
}

export function useSaleContext() {
    const ctx = useContext(SaleContext);
    if (!ctx) throw new Error('useSaleContext must be used within SaleProvider');
    return ctx;
}
