'use server';

import { createPurchase } from '@/lib/services/purchase';
import { ReStockType } from '@/types/purchase';

export async function createPurchaseAction(data: ReStockType) {
    try {
        return await createPurchase(data);
    } catch {
        throw new Error('No se pudo actualizar el stock del producto');
    }
}
