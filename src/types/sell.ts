import { Prisma } from '@/generated/prisma';

export type SellType = Prisma.SellGetPayload<{
    include: {
        items: true;
    };
}>;
