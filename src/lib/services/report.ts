import { prisma } from '@/lib/prisma';

export async function getProfitHistoric({ start, end }: { start?: Date; end?: Date }) {
    let result;

    if (start && end) {
        result = await prisma.$queryRaw<{ total: bigint }[]>`
        SELECT COALESCE(SUM(("unitPrice" - "purchasePrice") * "quantity"), 0) AS total
        FROM "SellItem" si
        JOIN "Sell" s ON s.id = si."sellId"
        WHERE s.date BETWEEN ${start} AND ${end};
    `;
    } else {
        result = await prisma.$queryRaw<{ total: bigint }[]>`
        SELECT COALESCE(SUM(("unitPrice" - "purchasePrice") * "quantity"), 0) AS total
        FROM "SellItem";
    `;
    }

    return Number(result[0]?.total ?? 0);
}
