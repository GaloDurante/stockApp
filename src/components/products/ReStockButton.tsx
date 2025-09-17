'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { StockFormType } from '@/types/form';
import { createPurchaseAction } from '@/lib/actions/purchase';

import { showSuccessToast, showErrorToast } from '@/components/Toast';
import { X } from 'lucide-react';
import Modal from '@/components/Modal';

interface ReStockButtonProp {
    productId: number;
    productName: string;
    productStock: number;
    productPurchasePrice: number;
}

export default function ReStockButton({
    productId,
    productName,
    productStock,
    productPurchasePrice,
}: ReStockButtonProp) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<StockFormType>();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();
    const onSubmit = async (data: StockFormType) => {
        const dataForm = {
            productId: productId,
            productName: productName,
            purchasePrice: productPurchasePrice,
            newStock: data.newStock,
        };
        try {
            await createPurchaseAction(dataForm);
            showSuccessToast('Stock actualizado con éxito');
            reset();
            router.refresh();
        } catch {
            showErrorToast('No se pudo actualizar el stock');
        } finally {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => {
                    setIsModalOpen(true);
                }}
                type="button"
                className="font-medium cursor-pointer border border-border py-2 px-4 rounded-md bg-surface hover:bg-border-dark transition-all"
            >
                Reponer stock
            </button>

            {isModalOpen && (
                <Modal
                    onClose={() => {
                        setIsModalOpen(false);
                    }}
                >
                    <div className="flex justify-between items-center p-4 border-b border-border bg-main rounded-t-xl">
                        <span id="modal-title" className="text-lg font-semibold">
                            Actualizar inventario
                        </span>
                        <button type="button" onClick={() => setIsModalOpen(false)}>
                            <X className="h-7 w-7 p-1 hover:bg-border rounded-full cursor-pointer transition-all" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                        <p>
                            Stock actual
                            <span
                                className={`text-lg font-semibold block ${
                                    productStock === 0
                                        ? 'text-red-700'
                                        : productStock > 0 && productStock < 8
                                          ? 'text-terciary'
                                          : ''
                                }`}
                            >
                                {productStock}
                            </span>
                        </p>
                        <div className="flex flex-col gap-1 my-4 w-full">
                            <label>
                                Nuevas unidades <span className="text-red-700">*</span>
                            </label>
                            <input
                                type="number"
                                {...register('newStock', {
                                    required: 'El campo es obligatorio',
                                    valueAsNumber: true,
                                    min: {
                                        value: 1,
                                        message: 'Debes ingresar unidades mayor a 0',
                                    },
                                })}
                                className={`p-2 border rounded-md ${errors.newStock ? 'border-red-700' : 'border-border'}`}
                            />
                            {errors.newStock && <p className="text-red-700 text-sm">{errors.newStock.message}</p>}
                        </div>
                        <div className="flex w-full justify-end mt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !isDirty}
                                className={`font-semibold ${isSubmitting || !isDirty ? 'cursor-not-allowed bg-muted' : 'cursor-pointer bg-secondary hover:bg-muted'} text-main border border-border py-2 px-4 rounded-md transition-all`}
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}
