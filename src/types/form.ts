import { Category, PaymentMethod, Receiver } from '@/generated/prisma';
import { ProductType } from '@/types/product';

export type OptionType = {
    label: string;
    value: string;
    isDisabled?: boolean;
};

export type ProductFormType = {
    name: string;
    description?: string;
    stock: number;
    purchasePrice: number;
    salePrice: number;
    salePriceBox?: number;
    unitsPerBox: number;
    category: Category;
};

export type LoginFormType = {
    username: string;
    password: string;
};

export type ProductSellFormType = ProductType & {
    quantity: number;
    newSalePrice?: number;
    isBox: boolean;
};

export type PaymentFormType = {
    method: PaymentMethod;
    amount: number | '';
    receiver?: Receiver | null;
};

export type SellFormType = {
    items: ProductSellFormType[];
    date: Date;
    payments: PaymentFormType[];
    totalPrice: number;
    note?: string | null;
};

export type StockFormType = {
    newStock: number;
};
