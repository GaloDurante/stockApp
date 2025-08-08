'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createProductAction } from '@/lib/actions/product';

import { ProductType } from '@/types/product';

import { showSuccessToast, showErrorToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

interface DuplicateButtonType {
    baseProduct: ProductType;
}

export default function DuplicateButton({ baseProduct }: DuplicateButtonType) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();
    const handleSubmit = async () => {
        const dataForm = {
            name: `${baseProduct.name} (copia)`,
            description: baseProduct.description ?? undefined,
            stock: 0,
            price: 0,
            category: baseProduct.category,
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

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                type="button"
                className="cursor-pointer border border-border p-2 rounded-md mb-4 bg-surface hover:bg-border-dark transition-all"
            >
                Duplicar producto
            </button>
            {isModalOpen && (
                <Modal
                    onClose={() => {
                        setIsModalOpen(false);
                    }}
                >
                    <ConfirmModal
                        isDelete={false}
                        customMessage={`Estas seguro de que deseas duplicar el producto ${baseProduct.name}? Esto creará un nuevo producto identico con el stock y precio en 0`}
                        entityItem={baseProduct.name}
                        onClose={() => setIsModalOpen(false)}
                        onTrigger={handleSubmit}
                    />
                </Modal>
            )}
        </>
    );
}
