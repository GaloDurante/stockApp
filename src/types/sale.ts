import { Prisma } from '@/generated/prisma';

export type SaleType = Prisma.SaleGetPayload<{
    include: {
        items: true;
        payments: {
            select: {
                receiver: true;
                method: true;
                id: true;
                amount: true;
            };
        };
    };
}>;
