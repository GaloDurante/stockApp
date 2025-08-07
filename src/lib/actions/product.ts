'use server';

import { deleteProductById } from '@/lib/services/product';

export async function deleteProductByIdAction(id: number) {
    try {
        return await deleteProductById(id);
    } catch {
        throw new Error('No se pudo eliminar el producto');
    }
}
