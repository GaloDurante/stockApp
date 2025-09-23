import { prisma } from '@/lib/prisma';

export async function getAccountMovements(limit = 50) {
    return prisma.accountMovement.findMany({
        orderBy: { date: 'desc' },
        take: limit,
    });
}
