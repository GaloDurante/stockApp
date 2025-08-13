import { useMemo, useEffect } from 'react';
import { UseFormRegister, UseFormWatch, FieldErrors, UseFormResetField, Control, Controller } from 'react-hook-form';

import { SellFormType } from '@/types/form';
import { Receiver, PaymentMethod } from '@/generated/prisma';

import CustomSelect from '@/components/CustomSelect';
import CustomDatePicker from '@/components/CustomDatePicker';

interface SellFormDetailsProps {
    resetField: UseFormResetField<SellFormType>;
    register: UseFormRegister<SellFormType>;
    errors: FieldErrors<SellFormType>;
    watch: UseFormWatch<SellFormType>;
    control: Control<SellFormType>;
}

export default function SellFormDetails({ control, errors, register, resetField, watch }: SellFormDetailsProps) {
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

    return (
        <>
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
        </>
    );
}
