import { prisma } from '@/lib/prisma';
import { Receiver } from '@/generated/prisma';
import { range } from '@formkit/tempo';
import { ChartsData } from '@/types/report';

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

    const rows = await prisma.$queryRaw<ChartsData[]>`
    WITH months AS (
        SELECT generate_series(${yStart}::timestamp, ${yEnd}::timestamp, interval '1 month') AS month_start
    ),
    monthly_sales_summary AS (
        SELECT
            date_trunc('month', s.date) AS month,
            SUM((si."unitPrice" - si."purchasePrice") * si.quantity) AS total_profit
        FROM "Sell" s
        JOIN "SellItem" si ON si."sellId" = s.id
        WHERE s.date BETWEEN ${yStart} AND ${yEnd}
        GROUP BY date_trunc('month', s.date)
    ),
    monthly_product_sales AS (
        SELECT
            date_trunc('month', s.date) AS month,
            si."productId",
            p.name AS product_name,
            SUM(si.quantity) AS total_quantity,
            ROW_NUMBER() OVER (PARTITION BY date_trunc('month', s.date)
                               ORDER BY SUM(si.quantity) DESC) as rank
        FROM "Sell" s
        JOIN "SellItem" si ON si."sellId" = s.id
        JOIN "Product" p ON p.id = si."productId"
        WHERE s.date BETWEEN ${yStart} AND ${yEnd}
        GROUP BY date_trunc('month', s.date), si."productId", p.name
    ),
    top_products_by_month AS (
        SELECT
            month,
            json_agg(
                json_build_object(
                    'productName', product_name,
                    'quantity', total_quantity
                ) ORDER BY total_quantity DESC
            ) FILTER (WHERE rank <= 3) as "topProducts"
        FROM monthly_product_sales
        GROUP BY month
    )
    SELECT
        TO_CHAR(m.month_start, 'YYYY-MM') AS month,
        COALESCE(mss.total_profit, 0) AS total,
        COALESCE(tp."topProducts", '[]'::json) as "topProducts"
    FROM months m
    LEFT JOIN monthly_sales_summary mss
        ON mss.month = m.month_start
    LEFT JOIN top_products_by_month tp
        ON tp.month = m.month_start
    ORDER BY m.month_start;
  `;

    return rows.map((r) => {
        const monthIndex = parseInt(r.month.split('-')[1], 10) - 1;
        return {
            month: months[monthIndex],
            total: Number(r.total),
            topProducts: r.topProducts,
        };
    });
}
