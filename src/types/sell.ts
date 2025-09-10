import { Prisma } from '@/generated/prisma';

export type SellType = Prisma.SellGetPayload<{
    include: {
        items: true;
        payments: {
            select: {
                receiver: true;
                method: true;
                id: true;
            };
        };
    };
}>;
