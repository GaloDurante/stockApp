import { prisma } from '@/lib/prisma';
import { Receiver } from '@/generated/prisma';
import { range } from '@formkit/tempo';

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

export async function getTotalProductsMoney(category?: string) {
    let result;

    if (category) {
        result = await prisma.$queryRaw<{ total: bigint }[]>`
        SELECT COALESCE(SUM("purchasePrice" * "stock"), 0) AS total
        FROM "Product"
        WHERE "category"::text = ${category};
    `;
    } else {
        result = await prisma.$queryRaw<{ total: bigint }[]>`
        SELECT COALESCE(SUM("purchasePrice" * "stock"), 0) AS total
        FROM "Product";
    `;
    }

    return Number(result[0]?.total ?? 0);
}

export async function getTotalReceivedByReceiver() {
    const result = await prisma.sell.groupBy({
        by: ['receiver'],
        _sum: {
            totalPrice: true,
        },
        where: {
            receiver: {
                not: null,
            },
        },
    });

    return result.map((r) => ({
        receiver: r.receiver as Receiver,
        total: Number(r._sum.totalPrice ?? 0),
    }));
}

export async function getProfitByMonthForYear(year: number) {
    const months = range('MMMM', 'es');

    const yStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    const yEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

    const rows = await prisma.$queryRaw<{ month: string; total: bigint }[]>`
    WITH months AS (
      SELECT generate_series(${yStart}::timestamp, ${yEnd}::timestamp, interval '1 month') AS month_start
    )
    SELECT
      TO_CHAR(m.month_start, 'YYYY-MM') AS month,
      COALESCE(SUM((si."unitPrice" - si."purchasePrice") * si.quantity), 0) AS total
    FROM months m
    LEFT JOIN "Sell" s
      ON date_trunc('month', s.date) = date_trunc('month', m.month_start)
    LEFT JOIN "SellItem" si
      ON si."sellId" = s.id
    GROUP BY m.month_start
    ORDER BY m.month_start;
  `;

    return rows.map((r) => {
        const monthIndex = parseInt(r.month.split('-')[1], 10) - 1;
        return {
            month: months[monthIndex],
            total: Number(r.total),
        };
    });
}
