import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { deleteAccountMovementByIdAction } from '@/lib/actions/accountMovement';
import { showSuccessToast, showErrorToast } from '@/components/Toast';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

interface DeleteMovementButtonProps {
    id: number;
    label: string;
}

export default function DeleteMovementButton({ id, label }: DeleteMovementButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            await deleteAccountMovementByIdAction(id);
            showSuccessToast('Movimiento eliminado con éxito');
            router.push('/admin/wallet');
        } catch {
            showErrorToast('No se pudo eliminar el movimiento');
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
                    <ConfirmModal entityItem={label} onClose={() => setIsModalOpen(false)} onTrigger={handleDelete} />
                </Modal>
            )}
        </>
    );
}
