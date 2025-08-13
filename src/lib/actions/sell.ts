'use server';
import { getAllSells, createSellAndSellItems, deleteSellAndRestoreStock } from '@/lib/services/sell';
import { SellFormType } from '@/types/form';

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
        if (item.quantity! > item.stock) {
            throw new Error(`Stock insuficiente para ${item.name}`);
        }
    });

    try {
        return await createSellAndSellItems(data);
    } catch {
        throw new Error('No se pudo crear la venta');
    }
}
