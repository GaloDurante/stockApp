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
    price: number;
    category: Category;
};

export type LoginFormType = {
    username: string;
    password: string;
};

export type ProductSellFormType = ProductType & { quantity: number };

export type SellFormType = {
    items: ProductSellFormType[];
    date: Date;
    paymentMethod: PaymentMethod;
    receiver?: Receiver | null;
    totalPrice: number;
    note?: string | null;
};
