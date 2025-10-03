import { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, Control, Controller, UseFormWatch, UseFormSetValue } from 'react-hook-form';

import { SaleFormType } from '@/types/form';

import CustomDatePicker from '@/components/CustomDatePicker';
import Switch from '@/components/Switch';

interface SaleFormDetailsProps {
    register: UseFormRegister<SaleFormType>;
    errors: FieldErrors<SaleFormType>;
    control: Control<SaleFormType>;
    watch: UseFormWatch<SaleFormType>;
    setValue: UseFormSetValue<SaleFormType>;
    shippingActive?: boolean;
}

export default function SaleFormDetails({
    control,
    errors,
    register,
    watch,
    setValue,
    shippingActive,
}: SaleFormDetailsProps) {
    const [checked, setChecked] = useState(shippingActive ?? false);

    useEffect(() => {
        if (!checked) {
            setValue('shippingPrice', null, { shouldDirty: true });
            setValue('supplierCoveredAmount', null, { shouldDirty: true });
        }
    }, [checked, setValue]);

    return (
        <>
            <div className="flex flex-col gap-1 mb-4">
                <label className="font-semibold">
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
                <label className="font-semibold">Nota</label>
                <textarea
                    {...register('note', {
                        maxLength: { value: 1000, message: 'La nota no puede superar los 1000 caracteres' },
                    })}
                    className={`p-2 border rounded-md resize-none ${errors.note ? 'border-red-700' : 'border-border'}`}
                    rows={4}
                />
                {errors.note && <p className="text-red-700 text-sm">{errors.note.message}</p>}
            </div>

            <div>
                <div className="flex items-center gap-3 mb-4">
                    <span className={` font-medium transition-colors ${checked ? 'text-muted' : 'font-semibold'}`}>
                        Sin envío
                    </span>

                    <Switch checked={checked} onChange={() => setChecked(!checked)} />

                    <span className={` font-medium transition-colors ${checked ? 'font-semibold' : 'text-muted'}`}>
                        Envío incluido
                    </span>
                </div>
                {checked && (
                    <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
                        <div className="flex-1">
                            <label className="block font-semibold mb-1">
                                Costo total de envío <span className="text-red-700">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                <input
                                    type="number"
                                    {...register(`shippingPrice`, {
                                        required: 'Debe ingresar el precio de envío',
                                        min: { value: 1, message: 'El monto debe ser mayor a 0' },
                                        valueAsNumber: true,
                                    })}
                                    className={`pl-6 border border-border rounded-lg py-2.5 px-3 w-full no-spinner ${
                                        errors.shippingPrice ? 'border-red-700' : 'border-border'
                                    }`}
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>
                            {errors.shippingPrice && (
                                <p className="text-red-700 text-sm mt-1">{errors.shippingPrice?.message}</p>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block font-semibold mb-1">
                                Contribución propia <span className="text-red-700">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                <input
                                    type="number"
                                    {...register(`supplierCoveredAmount`, {
                                        required: 'Debe ingresar el proporcional del costo de envío',
                                        min: { value: 1, message: 'El monto debe ser mayor a 0' },
                                        max: {
                                            value: watch('shippingPrice') ?? 0,
                                            message: 'El monto no puede superar el total del envío',
                                        },
                                        valueAsNumber: true,
                                    })}
                                    className={`pl-6 border border-border rounded-lg py-2.5 px-3 w-full no-spinner ${
                                        errors.supplierCoveredAmount ? 'border-red-700' : 'border-border'
                                    }`}
                                    onWheel={(e) => e.currentTarget.blur()}
                                />
                            </div>
                            {errors.supplierCoveredAmount && (
                                <p className="text-red-700 text-sm mt-1">{errors.supplierCoveredAmount.message}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
