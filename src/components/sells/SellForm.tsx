'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { SellFormType } from '@/types/form';
import { Receiver, PaymentMethod } from '@/generated/prisma';

import { LoaderCircle } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';
import CustomDatePicker from '@/components/CustomDatePicker';

export default function SellForm() {
    const {
        register,
        handleSubmit,
        control,
        watch,
        resetField,
        formState: { errors, isDirty },
    } = useForm<SellFormType>();
    const [isLoading, setIsLoading] = useState(false);

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

    const selectedPaymentMethod = watch('paymentMethod');
    useEffect(() => {
        if (selectedPaymentMethod !== 'Transfer') {
            resetField('receiver');
        }
    }, [selectedPaymentMethod, resetField]);

    const onSubmit = async (data: SellFormType) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border rounded-lg p-4 md:p-8">
            <div className="flex flex-col gap-1 mb-4">
                <label>
                    Fecha <span className="text-red-700">*</span>
                </label>
                <Controller
                    name="date"
                    control={control}
                    rules={{ required: 'Debe seleccionar una fecha' }}
                    render={({ field }) => {
                        return (
                            <CustomDatePicker
                                mode="single"
                                value={field.value}
                                onChange={field.onChange}
                                customPlaceholder="Selecciona una fecha"
                                isError={!!errors.date}
                            />
                        );
                    }}
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
                        const selectedValue = paymentMethodOptions.find((option) => option.value === field.value);

                        return (
                            <CustomSelect
                                instanceId="paymentMethod"
                                value={selectedValue || null}
                                options={paymentMethodOptions}
                                onChange={(newValue) => {
                                    field.onChange((newValue as { value: string }).value);
                                }}
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
                            const selectedValue = receiverOptions.find((option) => option.value === field.value);

                            return (
                                <CustomSelect
                                    instanceId="receiver"
                                    value={selectedValue || null}
                                    options={receiverOptions}
                                    onChange={(newValue) => {
                                        field.onChange((newValue as { value: string }).value);
                                    }}
                                    placeholder="Selecciona un receptor"
                                    isError={!!errors.receiver}
                                />
                            );
                        }}
                    />
                    {errors.receiver && <p className="text-red-700 text-sm">{errors.receiver.message}</p>}
                </div>
            )}

            <div className="flex w-full justify-end">
                <button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className={`font-semibold ${isLoading || !isDirty ? 'cursor-not-allowed bg-muted' : 'cursor-pointer bg-secondary hover:bg-muted'} text-main border border-border py-2 px-4 rounded-md transition-all`}
                >
                    {isLoading ? <LoaderCircle className="animate-spin" /> : 'Guardar'}
                </button>
            </div>
        </form>
    );
}
