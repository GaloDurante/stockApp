'use server';
import { ProductFormType } from '@/types/form';

import { deleteProductById, createProduct, updateProduct, getProductsByCategory } from '@/lib/services/product';

export async function deleteProductByIdAction(id: number) {
    try {
        return await deleteProductById(id);
    } catch {
        throw new Error('No se pudo eliminar el producto');
    }
}

export async function createProductAction(data: ProductFormType) {
    try {
        return await createProduct(data);
    } catch {
        throw new Error('No se pudo crear el producto');
    }
}

export async function updateProductAction(data: ProductFormType, id: number) {
    try {
        return await updateProduct(data, id);
    } catch {
        throw new Error('No se pudo actualizar el producto');
    }
}

export async function loadMoreProductsAction({
    search,
    filterByCategory,
    sortOrder,
    page,
    perPage,
}: {
    search?: string;
    filterByCategory?: string;
    sortOrder?: 'asc' | 'desc' | 'price_asc' | 'price_desc';
    page: number;
    perPage: number;
}) {
    try {
        const { products, total } = await getProductsByCategory({
            search,
            filterByCategory,
            sortOrder,
            page,
            perPage,
        });

        return { products, total };
    } catch {
        throw new Error('No se pudieron cargar más productos');
    }
}
