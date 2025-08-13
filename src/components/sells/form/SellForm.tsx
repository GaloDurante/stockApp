'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { ProductType } from '@/types/product';
import { SellFormType, ProductSellFormType } from '@/types/form';

import { formatPrice } from '@/lib/helpers/components/utils';

import { LoaderCircle, X } from 'lucide-react';
import Modal from '@/components/Modal';
import SelectProducts from '@/components/sells/form/SelectProducts';
import SellFormProducts from '@/components/sells/form/SellFormProducts';
import SellFormDetails from '@/components/sells/form/SellFormDetails';

interface SellFormProductsType {
    initialProducts: ProductType[];
    search?: string;
    filterByCategory?: string;
    perPage: number;
    totalCount: number;
}

export default function SellForm({
    initialProducts,
    search,
    filterByCategory,
    perPage,
    totalCount,
}: SellFormProductsType) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        resetField,
        setValue,
        clearErrors,
        formState: { errors, isDirty },
    } = useForm<SellFormType>({
        defaultValues: {
            items: [],
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedItems, setTempSelectedItems] = useState<ProductSellFormType[]>([]);

    const handleSaveSelection = () => {
        setValue('items', tempSelectedItems, { shouldDirty: true });
        setIsModalOpen(false);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const items = watch('items') || [];
    const totalVenta = items.reduce((acc, item) => {
        const qty = Number(item.quantity) || 1;
        const price = Number(item.price) || 0;
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

    const onSubmit = async (data: SellFormType) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="">
            <SellFormProducts
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
                    <div className="flex justify-between items-center p-4 border-b border-border bg-main rounded-t-xl">
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

            <div className="bg-surface p-8 rounded-lg border border-border mt-8">
                <SellFormDetails
                    control={control}
                    errors={errors}
                    register={register}
                    resetField={resetField}
                    watch={watch}
                />

                <div className="flex w-full justify-end items-center gap-4">
                    <div className="font-semibold text-lg">Total: {formatPrice(totalVenta)}</div>
                    <button
                        type="submit"
                        disabled={isLoading || !isDirty}
                        className={`font-semibold ${
                            isLoading || !isDirty
                                ? 'cursor-not-allowed bg-muted'
                                : 'cursor-pointer bg-secondary hover:bg-muted'
                        } text-main border border-border py-2 px-4 rounded-md transition-all`}
                    >
                        {isLoading ? <LoaderCircle className="animate-spin" /> : 'Guardar'}
                    </button>
                </div>
            </div>
        </form>
    );
}
