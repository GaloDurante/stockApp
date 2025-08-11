'use server';
import { getAllSells, deleteSellById } from '@/lib/services/sell';

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
        return await deleteSellById(id);
    } catch {
        throw new Error('No se pudo eliminar la venta');
    }
}
