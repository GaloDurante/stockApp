import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

export const getAllSells = async ({
    startDate,
    endDate,
    paymentMethod,
    sortOrder,
    page = 1,
    perPage = 20,
}: {
    startDate?: string;
    endDate?: string;
    paymentMethod?: 'Cash' | 'Transfer';
    sortOrder?: 'id_asc' | 'id_desc' | 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc';
    page?: number;
    perPage?: number;
}) => {
    const where: Prisma.SellWhereInput = {};

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
    if (Object.keys(dateFilter).length > 0) where.date = dateFilter;

    if (paymentMethod) {
        where.paymentMethod = paymentMethod;
    }

    const orderByMap: Record<string, Prisma.SellOrderByWithRelationInput> = {
        id_asc: { id: 'asc' },
        id_desc: { id: 'desc' },
        date_asc: { date: 'asc' },
        date_desc: { date: 'desc' },
        price_asc: { totalPrice: 'asc' },
        price_desc: { totalPrice: 'desc' },
    };

    const orderBy = orderByMap[sortOrder ?? 'id_asc'] ?? { id: 'asc' };

    const [sells, total] = await Promise.all([
        prisma.sell.findMany({
            where,
            include: { items: true },
            orderBy,
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.sell.count({ where }),
    ]);

    return { sells, total };
};

export async function deleteSellById(id: number) {
    return await prisma.sell.delete({
        where: { id },
    });
}
