'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash, Pencil } from 'lucide-react';

import { deleteProductByIdAction } from '@/lib/actions/product';

import { ProductType } from '@/types/product';

import { showErrorToast, showSuccessToast } from '@/components/Toast';
import Link from 'next/link';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

interface TableActionsButtonsType {
    row: ProductType;
}

export default function TableActionsButtons({ row }: TableActionsButtonsType) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const label = `${row.name}`;

    const handleDelete = async () => {
        setIsModalOpen(false);

        try {
            await deleteProductByIdAction(row.id);
            showSuccessToast('Producto eliminado con éxito');
            router.refresh();
        } catch {
            showErrorToast('No se pudo eliminar el producto');
        }
    };

    return (
        <>
            <>
                <Link
                    href={`/admin/products/${row.id}`}
                    className="hover:bg-border hover:text-white rounded-full p-2 transition"
                >
                    <Pencil size={16} />
                </Link>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="hover:bg-red-200 hover:text-red-700 rounded-full p-2 transition cursor-pointer"
                >
                    <Trash size={16} />
                </button>
            </>

            {isModalOpen && (
                <Modal
                    onClose={() => {
                        setIsModalOpen(false);
                    }}
                >
                    <ConfirmModal
                        entityItem={label || ''}
                        onClose={() => setIsModalOpen(false)}
                        onTrigger={handleDelete}
                    />
                </Modal>
            )}
        </>
    );
}
