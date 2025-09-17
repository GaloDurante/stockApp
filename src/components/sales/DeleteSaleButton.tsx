import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { deleteSaleByIdAction } from '@/lib/actions/sale';
import { showSuccessToast, showErrorToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

interface DeleteSaleButtonProps {
    saleId: number;
}

export default function DeleteSaleButton({ saleId }: DeleteSaleButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            await deleteSaleByIdAction(saleId);
            showSuccessToast('Venta eliminada con éxito');
            router.push('/admin/sales');
        } catch {
            showErrorToast('No se pudo eliminar la venta');
        } finally {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="font-semibold cursor-pointer py-2 px-4 rounded-md transition-all bg-red-700 hover:bg-red-900"
            >
                Eliminar
            </button>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <ConfirmModal
                        isTwoStep
                        confirmationText={`Venta-ID-${saleId}`}
                        entityItem={`la venta ID #${saleId}`}
                        onClose={() => setIsModalOpen(false)}
                        onTrigger={handleDelete}
                    />
                </Modal>
            )}
        </>
    );
}
