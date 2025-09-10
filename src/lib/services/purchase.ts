import { prisma } from '@/lib/prisma';
import { ReStockType } from '@/types/purchase';

export async function createPurchase(data: ReStockType) {
    return prisma.$transaction(async (tx) => {
        const purchase = await tx.purchase.create({
            data: {
                date: new Date(),
                items: {
                    create: {
                        productId: data.productId,
                        quantity: data.newStock,
                        purchasePrice: data.purchasePrice,
                    },
                },
            },
        });

        await tx.product.update({
            where: { id: data.productId },
            data: { stock: { increment: data.newStock } },
        });

        return purchase;
    });
}
