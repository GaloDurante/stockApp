import { Prisma } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

export async function getAccountMovements({
    startDate,
    endDate,
    sortOrder,
    page = 1,
    perPage = 20,
}: {
    startDate?: string;
    endDate?: string;
    sortOrder?: 'date_asc' | 'date_desc';
    page?: number;
    perPage?: number;
}) {
    const where: Prisma.AccountMovementWhereInput = {};

    const dateFilter: Prisma.DateTimeFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
    if (Object.keys(dateFilter).length > 0) where.date = dateFilter;

    const orderByMap: Record<string, Prisma.AccountMovementOrderByWithRelationInput> = {
        date_asc: { date: 'asc' },
        date_desc: { date: 'desc' },
    };

    const orderBy = orderByMap[sortOrder ?? 'date_desc'] ?? { date: 'desc' };

    const [movements, total] = await Promise.all([
        prisma.accountMovement.findMany({
            where,
            orderBy,
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.accountMovement.count({ where }),
    ]);

    return { movements, total };
}

export async function deleteAccountMovementById(id: number) {
    return await prisma.accountMovement.delete({
        where: { id },
    });
}
