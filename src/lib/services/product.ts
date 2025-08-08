import { prisma } from '@/lib/prisma';
import { Category } from '@/generated/prisma';

import { ProductFormType } from '@/types/form';

export const getProductsByCategory = async ({
    search,
    filterByCategory,
    sortOrder,
}: {
    search?: string;
    filterByCategory?: string;
    sortOrder?: 'asc' | 'desc' | 'price_asc' | 'price_desc';
}) => {
    return await prisma.product.findMany({
        where: {
            ...(search && {
                name: {
                    contains: search,
                    mode: 'insensitive' as const,
                },
            }),
            ...(filterByCategory && {
                category: filterByCategory as Category,
            }),
        },
        orderBy: sortOrder
            ? sortOrder === 'asc' || sortOrder === 'desc'
                ? { name: sortOrder }
                : sortOrder === 'price_asc'
                  ? { price: 'asc' }
                  : { price: 'desc' }
            : {},
    });
};

export async function getProductById(id: number) {
    return await prisma.product.findFirst({
        where: { id },
    });
}

export async function deleteProductById(id: number) {
    return await prisma.product.delete({
        where: { id },
    });
}

export async function createProduct(data: ProductFormType) {
    return await prisma.product.create({
        data,
    });
}

export async function updateProduct(data: ProductFormType, id: number) {
    return await prisma.product.update({
        where: { id },
        data,
    });
}
