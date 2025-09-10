import { useMemo } from 'react';
import {
    UseFormRegister,
    FieldErrors,
    Control,
    Controller,
    useFieldArray,
    useWatch,
    UseFormWatch,
    UseFormTrigger,
} from 'react-hook-form';

import { SellFormType } from '@/types/form';
import { Receiver, PaymentMethod } from '@/generated/prisma';

import { formatPrice } from '@/lib/helpers/components/utils';

import { Plus, Trash } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';

interface SellFormDetailsProps {
    register: UseFormRegister<SellFormType>;
    errors: FieldErrors<SellFormType>;
    control: Control<SellFormType>;
    watch: UseFormWatch<SellFormType>;
    trigger: UseFormTrigger<SellFormType>;
}

export default function SellFormDetails({ control, errors, register, watch, trigger }: SellFormDetailsProps) {
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
    register('payments', {
        validate: (payments: SellFormType['payments']) => {
            if (!payments || payments.length === 0) {
                return 'Debe agregar al menos un pago';
            }

            const total = watch('totalPrice') || 0;
            const sumPayments = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);

            if (sumPayments !== total) {
                return `La suma de pagos ${formatPrice(sumPayments)} no coincide con el total ${formatPrice(total)}`;
            }

            return true;
        },
    });

    return (
        <div>
            <div className="flex flex-col gap-2 items-start md:flex-row md:items-center justify-between">
                <div>
                    <h2>
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
                    <div key={field.id} className="rounded-xl border border-border p-5 mt-4 bg-main">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 text-accent border border-accent rounded-full flex items-center justify-center font-medium">
                                    {index + 1}
                                </div>
                                <h3 className="font-medium">Pago</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    remove(index);
                                    trigger('payments');
                                }}
                                className="cursor-pointer text-red-700 p-2 rounded-full hover:bg-border transition-colors"
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
                                                background="bg-main"
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
                                        const selectedValue = receiverOptions.find((opt) => opt.value === field.value);
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
                                                background="bg-main"
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
    );
}
