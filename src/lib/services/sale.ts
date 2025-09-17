import { Prisma, SaleStatus } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { SaleFormType } from '@/types/form';

export const getAllSales = async ({
    startDate,
    endDate,
    paymentMethod,
    sortOrder,
    status,
    page = 1,
    perPage = 20,
}: {
    startDate?: string;
    endDate?: string;
    paymentMethod?: 'Efectivo' | 'Transferencia';
    sortOrder?: 'id_asc' | 'id_desc' | 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc';
    status?: 'Pendiente' | 'Completada';
    page?: number;
    perPage?: number;
}) => {
    const where: Prisma.SaleWhereInput = {};

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
    if (Object.keys(dateFilter).length > 0) where.date = dateFilter;

    if (paymentMethod) {
        where.payments = {
            some: { method: paymentMethod },
        };
    }

    where.status = status ?? 'Completada';

    const orderByMap: Record<string, Prisma.SaleOrderByWithRelationInput> = {
        id_asc: { id: 'asc' },
        id_desc: { id: 'desc' },
        date_asc: { date: 'asc' },
        date_desc: { date: 'desc' },
        price_asc: { totalPrice: 'asc' },
        price_desc: { totalPrice: 'desc' },
    };

    const orderBy = orderByMap[sortOrder ?? 'id_asc'] ?? { id: 'asc' };

    const [sales, total] = await Promise.all([
        prisma.sale.findMany({
            where,
            include: {
                items: true,
                payments: {
                    select: {
                        receiver: true,
                        method: true,
                        id: true,
                        amount: true,
                    },
                },
            },
            orderBy,
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.sale.count({ where }),
    ]);

    return { sales, total };
};

export const getSaleById = async (id: number) => {
    return await prisma.sale.findUnique({
        where: { id },
        include: {
            items: true,
            payments: {
                select: {
                    receiver: true,
                    method: true,
                    id: true,
                    amount: true,
                },
            },
        },
    });
};

export async function deleteSaleAndRestoreStock(id: number) {
    return await prisma.$transaction(async (tx) => {
        const saleItems = await tx.saleItem.findMany({
            where: { saleId: id },
            select: { productId: true, quantity: true },
        });

        await Promise.all(
            saleItems.map((item) =>
                item.productId
                    ? tx.product.update({
                          where: { id: item.productId },
                          data: { stock: { increment: item.quantity } },
                      })
                    : null
            )
        );

        return tx.sale.delete({
            where: { id },
        });
    });
}

export async function createSaleAndSaleItems(data: SaleFormType) {
    const { items, payments, ...restData } = data;
    const formData = {
        ...restData,
        date: new Date(restData.date).toISOString(),
    };

    return prisma.$transaction(async (tx) => {
        const newSale = await tx.sale.create({ data: formData });

        await tx.saleItem.createMany({
            data: items.map((item) => ({
                saleId: newSale.id,
                productId: item.id,
                productName: item.name,
                quantity: item.quantity ?? 1,
                unitPrice: item.newSalePrice ?? item.salePrice,
                purchasePrice: item.purchasePrice,
                isBox: item.isBox,
                unitsPerBox: item.unitsPerBox,
            })),
        });

        await Promise.all(
            items.map((item) =>
                tx.product.update({
                    where: { id: item.id },
                    data: { stock: { decrement: item.quantity ?? 1 } },
                })
            )
        );

        await tx.payment.createMany({
            data: payments.map((p) => ({
                saleId: newSale.id,
                method: p.method,
                amount: Number(p.amount),
                receiver: p.receiver ?? null,
            })),
        });

        return newSale;
    });
}

export async function updateSale(id: number, data: SaleFormType, status: SaleStatus) {
    return prisma.$transaction(async (tx) => {
        const updatedSale = await tx.sale.update({
            where: { id },
            data: {
                note: data.note,
                status: status,
            },
        });

        await tx.payment.deleteMany({
            where: { saleId: id },
        });

        await tx.payment.createMany({
            data: data.payments.map((p) => ({
                saleId: id,
                method: p.method,
                amount: Number(p.amount),
                receiver: p.receiver ?? null,
            })),
        });

        return updatedSale;
    });
}
