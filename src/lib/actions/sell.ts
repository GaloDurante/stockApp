'use server';
import { getAllSells, createSellAndSellItems, deleteSellAndRestoreStock, updateSell } from '@/lib/services/sell';
import { SellFormType } from '@/types/form';
import { SellStatus } from '@/generated/prisma';

export async function loadMoreSellsAction({
    sortOrder,
    page,
    perPage,
}: {
    sortOrder?: 'id_asc' | 'id_desc' | 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc';
    page: number;
    perPage: number;
}) {
    try {
        const { sells, total } = await getAllSells({
            sortOrder,
            page,
            perPage,
        });

        return { sells, total };
    } catch {
        throw new Error('No se pudieron cargar más productos');
    }
}

export async function deleteSellByIdAction(id: number) {
    try {
        return await deleteSellAndRestoreStock(id);
    } catch {
        throw new Error('No se pudo eliminar la venta');
    }
}

export async function createSellAction(data: SellFormType) {
    if (!data.items || data.items.length === 0) {
        throw new Error('Debe seleccionar al menos un producto');
    }

    data.items.forEach((item) => {
        const totalQuantity = item.isBox ? item.quantity * item.unitsPerBox : item.quantity;

        if (totalQuantity > item.stock) {
            throw new Error(`Stock insuficiente para ${item.name}`);
        }

        item.quantity = totalQuantity;
    });

    try {
        return await createSellAndSellItems(data);
    } catch {
        throw new Error('No se pudo crear la venta');
    }
}

export async function updateSellAction(id: number, data: SellFormType, status: SellStatus) {
    if (!data.payments || data.payments.length === 0) {
        throw new Error('Debe agregar al menos un pago');
    }

    try {
        return await updateSell(id, data, status);
    } catch {
        throw new Error('No se pudo actualizar la venta');
    }
}
