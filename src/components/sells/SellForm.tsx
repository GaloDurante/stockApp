'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { ProductType } from '@/types/product';
import { SellFormType, ProductSellFormType } from '@/types/form';
import { Receiver, PaymentMethod } from '@/generated/prisma';

import { formatPrice } from '@/lib/helpers/components/utils';

import { LoaderCircle, X } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';
import CustomDatePicker from '@/components/CustomDatePicker';
import Modal from '@/components/Modal';
import SelectProducts from '@/components/sells/SelectProducts';

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
        formState: { errors, isDirty },
    } = useForm<SellFormType>({
        defaultValues: {
            items: [],
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedItems, setTempSelectedItems] = useState<ProductSellFormType[]>([]);

    const receiverOptions = useMemo(
        () =>
            Object.entries(Receiver).map(([key, value]) => ({
                value: key,
                label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace('_', ' '),
            })),
        []
    );

    const paymentMethodOptions = useMemo(
        () =>
            Object.entries(PaymentMethod).map(([key, value]) => ({
                value: key,
                label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace('_', ' '),
            })),
        []
    );

    const items = watch('items') || [];
    const totalVenta = items.reduce((acc, item) => acc + (item.quantity ?? 1) * item.price, 0);

    const openModal = () => {
        setTempSelectedItems(
            items.map((item) => ({
                ...item,
                quantity: item.quantity ?? 1,
            }))
        );
        setIsModalOpen(true);
    };

    const handleSaveSelection = () => {
        setValue('items', tempSelectedItems, { shouldDirty: true });
        setIsModalOpen(false);
    };

    const handleRemoveItem = (id: number) => {
        const newItems = items.filter((item) => item.id !== id);
        setValue('items', newItems, { shouldDirty: true });
    };

    const selectedPaymentMethod = watch('paymentMethod');
    useEffect(() => {
        if (selectedPaymentMethod !== 'Transfer') {
            resetField('receiver');
        }
    }, [selectedPaymentMethod, resetField]);

    useEffect(() => {
        setValue('totalPrice', totalVenta);
    }, [totalVenta, setValue]);

    const onSubmit = async (data: SellFormType) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="bg-surface p-8 rounded-lg border border-border">
                <div className="flex flex-col gap-1">
                    <label>
                        Productos <span className="text-red-700">*</span>
                    </label>

                    <button
                        type="button"
                        onClick={openModal}
                        className="font-semibold cursor-pointer bg-secondary hover:bg-muted text-main border border-border py-2 px-4 rounded-md transition-all w-fit"
                    >
                        Buscar productos
                    </button>

                    {items.length > 0 && (
                        <div className="mt-4 border border-border rounded-lg bg-main">
                            <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-2 bg-border sticky top-0 text-xs font-semibold rounded-t-md">
                                <span>Producto</span>
                                <span>Cantidad</span>
                                <span>Total</span>
                                <span></span>
                            </div>

                            {items.map((item, index) => {
                                const quantity = watch(`items.${index}.quantity`) ?? 1;
                                const totalItem = quantity * item.price;
                                return (
                                    <div
                                        key={item.id}
                                        className={`grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-2 items-center ${index != items.length - 1 && 'border-b border-border'}`}
                                    >
                                        <div>
                                            <span className="block font-semibold truncate">{item.name}</span>
                                            <span className="block mt-2 text-sm text-muted">
                                                {formatPrice(item.price)}
                                            </span>
                                        </div>

                                        <input
                                            type="number"
                                            min={1}
                                            {...register(`items.${index}.quantity`, {
                                                valueAsNumber: true,
                                                min: 1,
                                            })}
                                            defaultValue={item.quantity ?? 1}
                                            className="border border-border rounded-md w-16 text-center"
                                        />

                                        <span>{formatPrice(totalItem)}</span>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            aria-label={`Eliminar ${item.name}`}
                                            className="p-1 hover:bg-border rounded-full transition-all cursor-pointer"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {errors.items && <p className="text-red-700 text-sm">{errors.items.message}</p>}

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
                </div>
            </div>

            <div className="bg-surface p-8 rounded-lg border border-border mt-8">
                <div className="flex flex-col gap-1 mb-4">
                    <label>
                        Fecha <span className="text-red-700">*</span>
                    </label>
                    <Controller
                        name="date"
                        control={control}
                        rules={{ required: 'Debe seleccionar una fecha' }}
                        render={({ field }) => (
                            <CustomDatePicker
                                mode="single"
                                value={field.value}
                                onChange={field.onChange}
                                customPlaceholder="Selecciona una fecha"
                                isError={!!errors.date}
                            />
                        )}
                    />
                    {errors.date && <p className="text-red-700 text-sm">{errors.date.message}</p>}
                </div>

                <div className="flex flex-col gap-1 mb-4">
                    <label>
                        Método de Pago <span className="text-red-700">*</span>
                    </label>
                    <Controller
                        name="paymentMethod"
                        control={control}
                        rules={{ required: 'Debe seleccionar un método de pago' }}
                        render={({ field }) => {
                            const selectedValue = paymentMethodOptions.find((opt) => opt.value === field.value);
                            return (
                                <CustomSelect
                                    instanceId="paymentMethod"
                                    value={selectedValue || null}
                                    options={paymentMethodOptions}
                                    onChange={(newValue) => field.onChange((newValue as { value: string }).value)}
                                    placeholder="Selecciona un método de pago"
                                    isError={!!errors.paymentMethod}
                                />
                            );
                        }}
                    />
                    {errors.paymentMethod && <p className="text-red-700 text-sm">{errors.paymentMethod.message}</p>}
                </div>

                {selectedPaymentMethod === 'Transfer' && (
                    <div className="flex flex-col gap-1 mb-4">
                        <label>
                            Receptor <span className="text-red-700">*</span>
                        </label>
                        <Controller
                            name="receiver"
                            control={control}
                            rules={{ required: 'Debe seleccionar un receptor' }}
                            render={({ field }) => {
                                const selectedValue = receiverOptions.find((opt) => opt.value === field.value);
                                return (
                                    <CustomSelect
                                        instanceId="receiver"
                                        value={selectedValue || null}
                                        options={receiverOptions}
                                        onChange={(newValue) => field.onChange((newValue as { value: string }).value)}
                                        placeholder="Selecciona un receptor"
                                        isError={!!errors.receiver}
                                    />
                                );
                            }}
                        />
                        {errors.receiver && <p className="text-red-700 text-sm">{errors.receiver.message}</p>}
                    </div>
                )}

                <div className="flex flex-col gap-1 mb-4">
                    <label>Nota</label>
                    <textarea
                        {...register('note', {
                            maxLength: {
                                value: 1000,
                                message: 'La nota no puede superar los 1000 caracteres',
                            },
                        })}
                        className={`p-2 border rounded-md resize-none ${errors.note ? 'border-red-700' : 'border-border'}`}
                        rows={4}
                    />
                    {errors.note && <p className="text-red-700 text-sm">{errors.note.message}</p>}
                </div>

                <div className="flex w-full justify-end items-center gap-4">
                    <div className="font-semibold text-lg">Total: {formatPrice(totalVenta)}</div>
                    {errors.receiver && <p className="text-red-700 text-sm">{errors.receiver.message}</p>}
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
