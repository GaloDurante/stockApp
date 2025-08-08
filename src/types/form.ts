import { Category } from '@/generated/prisma';

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
