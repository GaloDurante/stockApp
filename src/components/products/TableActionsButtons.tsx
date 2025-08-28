'use client';

import { Trash, Pencil } from 'lucide-react';

import Link from 'next/link';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

interface TableActionsButtonsType {
    handleDelete: () => void;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    label: string;
    redirect: string;
    isTwoStep?: boolean;
    confirmationText?: string;
    hideEditButton?: boolean;
}

export default function TableActionsButtons({
    handleDelete,
    label,
    isModalOpen,
    openModal,
    closeModal,
    redirect,
    isTwoStep = false,
    confirmationText,
    hideEditButton = false,
}: TableActionsButtonsType) {
    return (
        <>
            {!hideEditButton && (
                <Link href={redirect} className="hover:bg-border hover:text-white rounded-full p-2 transition">
                    <Pencil size={16} />
                </Link>
            )}

            <button
                onClick={openModal}
                className="hover:bg-red-200 hover:text-red-700 rounded-full p-2 transition cursor-pointer"
            >
                <Trash size={16} />
            </button>

            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <ConfirmModal
                        isTwoStep={isTwoStep}
                        confirmationText={confirmationText}
                        entityItem={label || ''}
                        onClose={closeModal}
                        onTrigger={handleDelete}
                    />
                </Modal>
            )}
        </>
    );
}
