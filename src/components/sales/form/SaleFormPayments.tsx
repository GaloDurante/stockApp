'use client';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form';
import { useSaleContext } from '@/context/SaleContext';

import { SaleFormType } from '@/types/form';
import { SaleType } from '@/types/sale';
import { Receiver, PaymentMethod } from '@/generated/prisma';

import { formatPrice } from '@/lib/helpers/components/utils';
import { updateSaleAction } from '@/lib/actions/sale';

import { Plus, Trash } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/components/Toast';
import CustomSelect from '@/components/CustomSelect';
import SaleFormDetails from '@/components/sales/form/SaleFormDetails';
import DeleteSaleButton from '@/components/sales/DeleteSaleButton';

interface SaleFormPaymentsProps {
    saleData: SaleType;
}

export default function SaleFormPayments({ saleData }: SaleFormPaymentsProps) {
    const {
        control,
        register,
        trigger,
        watch,
        handleSubmit,
        setValue,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<SaleFormType>({
        defaultValues: {
            payments: saleData.payments ?? [],
            totalPrice: saleData.totalPrice,
            note: saleData.note ?? null,
            date: saleData.date ?? undefined,
            shippingPrice: saleData.shippingPrice ?? null,
            supplierCoveredAmount: saleData.supplierCoveredAmount ?? null,
        },
    });

    const router = useRouter();
    const { setTotalPrice, setShippingPrice, setSupplierCoveredAmount } = useSaleContext();

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

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'payments',
    });

    const payments = useWatch({ control, name: 'payments' }) || [];
    const shippingPrice = watch('shippingPrice') ?? 0;
    const supplierCoveredAmount = watch('supplierCoveredAmount') ?? 0;

    const basePrice = saleData.totalPrice - (saleData.shippingPrice ?? 0) + (saleData.supplierCoveredAmount ?? 0);
    const totalSalePrice = basePrice + (shippingPrice - supplierCoveredAmount);

    register('payments', {
        validate: (payments: SaleFormType['payments']) => {
            const sumPayments = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
            if (sumPayments > totalSalePrice) {
                return `El total de los pagos (${formatPrice(sumPayments)}) no debe superar el total de la venta (${formatPrice(totalSalePrice)})`;
            }
            return true;
        },
    });

    useEffect(() => {
        setValue('totalPrice', totalSalePrice);
        setTotalPrice(totalSalePrice);
        setShippingPrice(shippingPrice);
        setSupplierCoveredAmount(supplierCoveredAmount);
    }, [
        totalSalePrice,
        shippingPrice,
        setTotalPrice,
        setShippingPrice,
        setValue,
        supplierCoveredAmount,
        setSupplierCoveredAmount,
    ]);

    const onSubmitPayment = async (data: SaleFormType) => {
        try {
            let newStatus = saleData.status;
            const sumPayments = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
            newStatus = sumPayments === totalSalePrice ? 'Completada' : 'Pendiente';

            await updateSaleAction(saleData.id, data, newStatus);
            showSuccessToast('Venta actualizada con éxito');
            router.refresh();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'No se pudo actualizar la venta';
            showErrorToast(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmitPayment)}>
            <div className="bg-surface p-6 md:p-8 rounded-lg border border-border mt-8">
                <div className="flex flex-col gap-2 items-start md:flex-row md:items-center justify-between">
                    <div>
                        <h2 className="font-semibold">
                            Pagos <span className="text-red-700">*</span>
                        </h2>
                        <p className="text-sm text-muted mt-1">Agregue los métodos de pago para esta venta</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            append({ method: PaymentMethod.Efectivo, amount: '' });
                        }}
                        className="font-medium flex items-center gap-1 bg-accent hover:bg-accent-hover py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                        <Plus size={18} />
                        Agregar pago
                    </button>
                </div>

                {fields.map((field, index) => {
                    const selectedMethod = payments?.[index]?.method;

                    return (
                        <div key={field.id} className="rounded-lg border border-border p-5 mt-4 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-9 h-9 bg-accent/30 text-accent rounded-full flex items-center justify-center font-medium">
                                        {index + 1}
                                    </span>
                                    <h3 className="font-medium">Pago</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        remove(index);
                                        trigger('payments');
                                    }}
                                    className="cursor-pointer p-2 rounded-full hover:bg-red-200 hover:text-red-700 transition-colors"
                                    title="Eliminar pago"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Método de pago</label>
                                    <Controller
                                        name={`payments.${index}.method`}
                                        control={control}
                                        rules={{ required: 'Seleccione un método' }}
                                        render={({ field }) => {
                                            const selectedValue = paymentMethodOptions.find(
                                                (opt) => opt.value === field.value
                                            );
                                            return (
                                                <CustomSelect
                                                    instanceId={`paymentMethod-${index}`}
                                                    value={selectedValue || null}
                                                    options={paymentMethodOptions}
                                                    onChange={(newValue) =>
                                                        field.onChange((newValue as { value: string }).value)
                                                    }
                                                    isError={!!errors.payments?.[index]?.method}
                                                />
                                            );
                                        }}
                                    />
                                    {errors.payments?.[index]?.method && (
                                        <p className="text-red-700 text-sm mt-1">
                                            {errors.payments[index]?.method?.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm mb-1">Monto</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                        <input
                                            type="number"
                                            {...register(`payments.${index}.amount`, {
                                                required: 'Debe ingresar el monto',
                                                min: { value: 1, message: 'El monto debe ser mayor a 0' },
                                                valueAsNumber: true,
                                            })}
                                            className={`pl-6 border border-border rounded-lg py-2.5 px-3 w-full no-spinner ${
                                                errors.payments?.[index]?.amount ? 'border-red-700' : 'border-border'
                                            }`}
                                        />
                                    </div>
                                    {errors.payments?.[index]?.amount && (
                                        <p className="text-red-700 text-sm mt-1">
                                            {errors.payments[index]?.amount?.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {selectedMethod === PaymentMethod.Transferencia && (
                                <div className="mt-4">
                                    <label className="block text-sm mb-1">Receptor</label>
                                    <Controller
                                        name={`payments.${index}.receiver`}
                                        control={control}
                                        rules={{ required: 'Debe seleccionar un receptor' }}
                                        render={({ field }) => {
                                            const selectedValue = receiverOptions.find(
                                                (opt) => opt.value === field.value
                                            );
                                            return (
                                                <CustomSelect
                                                    instanceId={`receiver-${index}`}
                                                    value={selectedValue || null}
                                                    options={receiverOptions}
                                                    onChange={(newValue) =>
                                                        field.onChange((newValue as { value: string }).value)
                                                    }
                                                    placeholder="Selecciona un receptor"
                                                    isError={!!errors.payments?.[index]?.receiver}
                                                />
                                            );
                                        }}
                                    />
                                    {errors.payments?.[index]?.receiver && (
                                        <p className="text-red-700 text-sm mt-1">
                                            {errors.payments[index]?.receiver?.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
                {errors.payments?.root?.message && (
                    <p className="text-red-700 text-sm mt-1">{errors.payments.root.message}</p>
                )}
            </div>

            <div className="bg-surface p-6 md:p-8 rounded-lg border border-border mt-8">
                <SaleFormDetails
                    control={control}
                    errors={errors}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    shippingActive={!!saleData.shippingPrice}
                />
            </div>
            <div className="flex w-full justify-end items-center gap-4 mt-4">
                <DeleteSaleButton saleId={saleData.id} />
                <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className={`font-semibold ${isSubmitting || !isDirty ? 'cursor-not-allowed bg-muted' : 'cursor-pointer bg-secondary hover:bg-muted'} text-main border border-border py-2 px-4 rounded-md transition-all`}
                >
                    Guardar
                </button>
            </div>
        </form>
    );
}
