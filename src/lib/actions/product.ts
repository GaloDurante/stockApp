'use server';
import { ProductFormType } from '@/types/form';

import { deleteProductById, createProduct } from '@/lib/services/product';

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
