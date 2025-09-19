'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ProductFormType } from '@/types/form';
import { updateProductAction } from '@/lib/actions/product';

import { showSuccessToast, showErrorToast } from '@/components/Toast';
import { X } from 'lucide-react';
import Modal from '@/components/Modal';

interface ReduceStockButtonProp {
    productId: number;
    productStock: number;
}

export default function ReduceStockButton({ productId, productStock }: ReduceStockButtonProp) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<ProductFormType>({
        defaultValues: {
            stock: productStock,
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();
    const onSubmit = async (data: ProductFormType) => {
        try {
            await updateProductAction(data, productId);
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
                Reducir stock
            </button>

            {isModalOpen && (
                <Modal
                    onClose={() => {
                        setIsModalOpen(false);
                        reset();
                    }}
                >
                    <div className="flex justify-between items-center p-4 border-b border-border bg-main rounded-t-xl">
                        <span id="modal-title" className="text-lg font-semibold">
                            Actualizar inventario
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                reset();
                            }}
                        >
                            <X className="h-7 w-7 p-1 hover:bg-border rounded-full cursor-pointer transition-all" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
                        <div className="flex flex-col gap-1 w-full">
                            <label>
                                Stock <span className="text-red-700">*</span>
                            </label>
                            <input
                                type="number"
                                {...register('stock', {
                                    required: 'El campo es obligatorio',
                                    valueAsNumber: true,
                                    min: {
                                        value: 0,
                                        message: 'El stock no puede ser menor a 0',
                                    },
                                    max: {
                                        value: Number(productStock) ?? 0,
                                        message: 'No puedes ingresar nuevas unidades en este formulario.',
                                    },
                                })}
                                className={`p-2 border rounded-md ${errors.stock ? 'border-red-700' : 'border-border'}`}
                            />
                            {errors.stock && <p className="text-red-700 text-sm">{errors.stock.message}</p>}
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
