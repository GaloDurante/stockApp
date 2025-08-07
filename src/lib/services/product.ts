import { prisma } from '@/lib/prisma';

export const getProductsByCategory = async () => {
    return await prisma.product.findMany();
};

export async function deleteProductById(id: number) {
    return await prisma.product.delete({
        where: { id },
    });
}
