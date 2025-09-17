'use server';
import { getAllSales, createSaleAndSaleItems, deleteSaleAndRestoreStock, updateSale } from '@/lib/services/sale';
import { SaleFormType } from '@/types/form';
import { SaleStatus } from '@/generated/prisma';

export async function loadMoreSalesAction({
    sortOrder,
    page,
    perPage,
}: {
    sortOrder?: 'id_asc' | 'id_desc' | 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc';
    page: number;
    perPage: number;
}) {
    try {
        const { sales, total } = await getAllSales({
            sortOrder,
            page,
            perPage,
        });

        return { sales, total };
    } catch {
        throw new Error('No se pudieron cargar más productos');
    }
}

export async function deleteSaleByIdAction(id: number) {
    try {
        return await deleteSaleAndRestoreStock(id);
    } catch {
        throw new Error('No se pudo eliminar la venta');
    }
}

export async function createSaleAction(data: SaleFormType) {
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
        return await createSaleAndSaleItems(data);
    } catch {
        throw new Error('No se pudo crear la venta');
    }
}

export async function updateSaleAction(id: number, data: SaleFormType, status: SaleStatus) {
    if (!data.payments || data.payments.length === 0) {
        throw new Error('Debe agregar al menos un pago');
    }

    try {
        return await updateSale(id, data, status);
    } catch {
        throw new Error('No se pudo actualizar la venta');
    }
}
