'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createProductAction, deleteProductByIdAction } from '@/lib/actions/product';

import { ProductType } from '@/types/product';

import { showSuccessToast, showErrorToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import ReStockButton from '@/components/ReStockButton';
import ReduceStockButton from '@/components/ReduceStockButton';

interface DuplicateButtonType {
    baseProduct: ProductType;
}

export default function DuplicateButton({ baseProduct }: DuplicateButtonType) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    const router = useRouter();
    const handleSubmit = async () => {
        const dataForm = {
            name: `${baseProduct.name} (copia)`,
            description: baseProduct.description ?? undefined,
            stock: 0,
            purchasePrice: 0,
            salePrice: 0,
            salePriceBox: 0,
            category: baseProduct.category,
            unitsPerBox: baseProduct.unitsPerBox,
        };
        try {
            const newProduct = await createProductAction(dataForm);
            showSuccessToast('Producto duplicado con éxito');
            router.push(`/admin/products/${newProduct.id}`);
        } catch {
            showErrorToast('No se pudo duplicar el producto');
        } finally {
            setIsModalOpen(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteProductByIdAction(baseProduct.id);
            showSuccessToast('Producto eliminado con éxito');
            router.push('/admin/products');
        } catch {
            showErrorToast('No se pudo eliminar el producto');
        } finally {
            setIsModalOpen(false);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 mb-4 gap-4">
            <ReStockButton
                productId={baseProduct.id}
                productPurchasePrice={baseProduct.purchasePrice}
                productStock={baseProduct.stock}
            />
            <ReduceStockButton productId={baseProduct.id} productStock={baseProduct.stock} />
            <button
                onClick={() => {
                    setIsDelete(false);
                    setIsModalOpen(true);
                }}
                type="button"
                className="font-medium cursor-pointer border border-border py-2 px-4 rounded-md bg-surface hover:bg-border-dark transition-all"
            >
                Duplicar producto
            </button>
            <button
                onClick={() => {
                    setIsDelete(true);
                    setIsModalOpen(true);
                }}
                type="button"
                className="font-medium cursor-pointer py-2 px-4 rounded-md transition-all bg-red-700 hover:bg-red-900"
            >
                Eliminar
            </button>
            {isModalOpen && (
                <Modal
                    onClose={() => {
                        setIsModalOpen(false);
                    }}
                >
                    <ConfirmModal
                        isDelete={isDelete}
                        customMessage={
                            !isDelete
                                ? `Estas seguro de que deseas duplicar el producto ${baseProduct.name}? Esto creará un nuevo producto identico con el stock y precio en 0`
                                : undefined
                        }
                        entityItem={baseProduct.name}
                        onClose={() => setIsModalOpen(false)}
                        onTrigger={isDelete ? handleDelete : handleSubmit}
                    />
                </Modal>
            )}
        </div>
    );
}
