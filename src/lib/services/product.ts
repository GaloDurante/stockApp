import { prisma } from '@/lib/prisma';

export const getProductsByCategory = async () => {
    return await prisma.product.findMany();
};
