import { prisma } from '@/lib/prisma';
import { Category } from '@/generated/prisma';

import { ProductFormType } from '@/types/form';

export const getProductsByCategory = async ({
    search,
    filterByCategory,
    sortOrder,
    page = 1,
    perPage = 20,
}: {
    search?: string;
    filterByCategory?: string;
    sortOrder?: 'asc' | 'desc' | 'price_asc' | 'price_desc';
    page?: number;
    perPage?: number;
}) => {
    const where = {
        ...(search && {
            name: {
                contains: search,
                mode: 'insensitive' as const,
            },
        }),
        ...(filterByCategory && {
            category: filterByCategory as Category,
        }),
    };

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: sortOrder
                ? sortOrder === 'asc' || sortOrder === 'desc'
                    ? [{ name: sortOrder }, { id: 'asc' }]
                    : sortOrder === 'price_asc'
                      ? [{ purchasePrice: 'asc' }, { id: 'asc' }]
                      : [{ purchasePrice: 'desc' }, { id: 'asc' }]
                : {},
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.product.count({ where }),
    ]);

    return {
        products,
        total,
    };
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
