'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ProductType } from '@/types/product';
import { SaleFormType, ProductSaleFormType } from '@/types/form';

import { createSaleAction } from '@/lib/actions/sale';
import { formatPrice } from '@/lib/helpers/components/utils';

import { showErrorToast, showSuccessToast } from '@/components/Toast';
import { LoaderCircle, X } from 'lucide-react';
import Modal from '@/components/Modal';
import SelectProducts from '@/components/sales/form/SelectProducts';
import SaleFormProducts from '@/components/sales/form/SaleFormProducts';
import SaleFormDetails from '@/components/sales/form/SaleFormDetails';

interface SaleFormProductsType {
    initialProducts: ProductType[];
    search?: string;
    filterByCategory?: string;
    perPage: number;
    totalCount: number;
}

export default function SaleForm({
    initialProducts,
    search,
    filterByCategory,
    perPage,
    totalCount,
}: SaleFormProductsType) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        clearErrors,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<SaleFormType>({
        defaultValues: {
            items: [],
            payments: [],
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedItems, setTempSelectedItems] = useState<ProductSaleFormType[]>([]);
    const router = useRouter();

    const handleSaveSelection = () => {
        setValue('items', tempSelectedItems, { shouldDirty: true });
        setIsModalOpen(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const items = watch('items') || [];
    const totalVenta = items.reduce((acc, item) => {
        const qty = Number(item.quantity) || 1;
        const price = Number(item.newSalePrice) || 0;
        return acc + qty * price;
    }, 0);

    useEffect(() => {
        setValue('totalPrice', totalVenta);
    }, [totalVenta, setValue]);

    useEffect(() => {
        register('items', {
            validate: (value) => (value && value.length > 0) || 'Debe seleccionar al menos un producto',
        });
    }, [register]);

    useEffect(() => {
        if (items.length > 0) {
            clearErrors('items');
        }
    }, [items, clearErrors]);

    const onSubmit = async (data: SaleFormType) => {
        try {
            const newSale = await createSaleAction(data);
            showSuccessToast('Venta creada con éxito');
            router.push(`/admin/sales/${newSale.id}`);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'No se pudo crear la venta';
            showErrorToast(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 2xl:flex-row-reverse">
            <div className="flex-1 bg-surface p-6 md:p-8 rounded-lg border border-border max-h-fit 2xl:sticky top-8 shadow-lg">
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 shadow-lg rounded-lg border border-border">
                        <span className="text-muted text-sm md:text-base">Total:</span>
                        <span className="text-lg md:text-xl font-bold">{formatPrice(totalVenta)}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 shadow-lg rounded-lg border border-border">
                        <span className="text-muted text-sm md:text-base">Seleccionados:</span>
                        <span className="text-lg md:text-xl font-semibold">
                            {items.length} {items.length === 1 ? 'producto' : 'productos'}
                        </span>
                    </div>

                    {items.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <h3 className="text-sm font-medium text-muted mb-2">Resumen:</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {items.map((item, index) => {
                                    const quantity = watch(`items.${index}.quantity`) ?? 1;
                                    const salePrice = watch(`items.${index}.newSalePrice`) ?? item.salePrice;
                                    const totalItem = salePrice && quantity ? quantity * salePrice : 0;

                                    return (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="truncate max-w-[70%]">{item.name}</span>
                                            <span className="font-medium">{formatPrice(totalItem)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-3">
                <SaleFormProducts
                    errors={errors}
                    items={items}
                    register={register}
                    setIsModalOpen={setIsModalOpen}
                    setTempSelectedItems={setTempSelectedItems}
                    setValue={setValue}
                    watch={watch}
                />
                {isModalOpen && (
                    <Modal isLarge onClose={() => setIsModalOpen(false)}>
                        <div className="flex justify-between items-center p-4 border-b border-border shadow-lg rounded-t-xl">
                            <span className="text-lg font-semibold">Seleccione productos</span>
                            <button type="button" onClick={() => setIsModalOpen(false)}>
                                <X className="h-7 w-7 p-1 hover:bg-border rounded-full cursor-pointer transition-all" />
                            </button>
                        </div>

                        <SelectProducts
                            perPage={perPage}
                            totalCount={totalCount}
                            initialProducts={initialProducts}
                            search={search}
                            filterByCategory={filterByCategory}
                            selectedItems={tempSelectedItems}
                            onChange={setTempSelectedItems}
                        />

                        <div className="flex justify-end p-4 border-t border-border">
                            <button
                                type="button"
                                onClick={handleSaveSelection}
                                className="cursor-pointer bg-secondary font-semibold text-main px-4 py-2 rounded-md hover:bg-muted transition-colors"
                            >
                                Guardar selección
                            </button>
                        </div>
                    </Modal>
                )}
                <div className="bg-surface p-6 md:p-8 rounded-lg border border-border mt-8">
                    <SaleFormDetails control={control} errors={errors} register={register} watch={watch} />
                </div>
                <div className="flex justify-end items-center gap-4 mt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || !isDirty}
                        className={`font-semibold ${
                            isSubmitting || !isDirty
                                ? 'cursor-not-allowed bg-muted'
                                : 'cursor-pointer bg-secondary hover:bg-muted'
                        } text-main border border-border py-2 px-4 rounded-md transition-all`}
                    >
                        {isSubmitting ? <LoaderCircle className="animate-spin" /> : 'Guardar'}
                    </button>
                </div>
            </div>
        </form>
    );
}
