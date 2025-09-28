'use client';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { AccountMovementFormType } from '@/types/form';
import { Receiver, MovementType } from '@/generated/prisma';
import { AccountMovementType } from '@/types/accountMovement';
import { formatPrice } from '@/lib/helpers/components/utils';

import { createAccountMovementAction, updateAccountMovementAction } from '@/lib/actions/accountMovement';

import { LoaderCircle } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/components/Toast';
import CustomSelect from '@/components/CustomSelect';
import CustomDatePicker from '@/components/CustomDatePicker';
import DeleteMovementButton from '@/components/wallet/DeleteMovementButton';

interface AccountMovementFormProps {
    selectedMovement?: AccountMovementType;
    isEdit?: boolean;
}

export default function AccountMovementForm({ selectedMovement, isEdit = false }: AccountMovementFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<AccountMovementFormType>({
        defaultValues:
            isEdit && selectedMovement
                ? {
                      type: selectedMovement.type,
                      receiver: selectedMovement.receiver,
                      amount: selectedMovement.amount,
                      date: selectedMovement.date,
                      description: selectedMovement.description ?? undefined,
                  }
                : {},
    });

    const movementTypeOptions = Object.entries(MovementType).map(([key, value]) => ({
        value: key,
        label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace('_', ' '),
    }));

    const receiversOptions = Object.entries(Receiver).map(([key, value]) => ({
        value: key,
        label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace('_', ' '),
    }));

    const onSubmit = async (data: AccountMovementFormType) => {
        const now = new Date();
        data.date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

        if (isEdit && selectedMovement) {
            try {
                await updateAccountMovementAction(data, selectedMovement.id);
                showSuccessToast('Movimiento actualizado con éxito');
                router.refresh();
            } catch {
                showErrorToast('No se pudo actualizar el movimiento');
            }
        } else {
            try {
                await createAccountMovementAction(data);
                showSuccessToast('Movimiento creado con éxito');
                router.push(`/admin/wallet/`);
            } catch {
                showErrorToast('No se pudo crear el movimiento');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-surface border border-border rounded-lg p-6 md:p-8">
                <div className="flex flex-col gap-1 mb-4 w-full">
                    <label className="font-semibold">
                        Tipo de movimiento <span className="text-red-700">*</span>
                    </label>
                    <Controller
                        name={`type`}
                        control={control}
                        rules={{ required: 'Debe seleccionar un tipo' }}
                        render={({ field }) => {
                            const selectedValue = movementTypeOptions.find((opt) => opt.value === field.value);
                            return (
                                <CustomSelect
                                    instanceId={`type`}
                                    value={selectedValue || null}
                                    options={movementTypeOptions}
                                    onChange={(newValue) => field.onChange((newValue as { value: string }).value)}
                                    placeholder="Selecciona un tipo"
                                    isError={!!errors.type}
                                />
                            );
                        }}
                    />
                    {errors.type && <p className="text-red-700 text-sm mt-1">{errors.type.message}</p>}
                </div>

                <div className="flex flex-col gap-1 mb-4 w-full">
                    <label className="font-semibold">
                        Receptor <span className="text-red-700">*</span>
                    </label>
                    <Controller
                        name={`receiver`}
                        control={control}
                        rules={{ required: 'Debe seleccionar un receptor' }}
                        render={({ field }) => {
                            const selectedValue = receiversOptions.find((opt) => opt.value === field.value);
                            return (
                                <CustomSelect
                                    instanceId={`receiver`}
                                    value={selectedValue || null}
                                    options={receiversOptions}
                                    onChange={(newValue) => field.onChange((newValue as { value: string }).value)}
                                    placeholder="Selecciona un receptor"
                                    isError={!!errors.receiver}
                                />
                            );
                        }}
                    />
                    {errors.receiver && <p className="text-red-700 text-sm mt-1">{errors.receiver.message}</p>}
                </div>

                <div className="flex flex-col gap-1 mb-4 w-full">
                    <label className="font-semibold">
                        Monto <span className="text-red-700">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2">$</span>
                        <input
                            type="number"
                            {...register('amount', {
                                required: 'El monto es obligatorio',
                                valueAsNumber: true,
                                min: {
                                    value: 0,
                                    message: 'El monto no puede ser menor a 0',
                                },
                            })}
                            className={`p-2 pl-6 border rounded-md no-spinner w-full ${errors.amount ? 'border-red-700' : 'border-border'}`}
                        />
                    </div>
                    {errors.amount && <p className="text-red-700 text-sm">{errors.amount.message}</p>}
                </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6 md:p-8 mt-8">
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
                    <label className="font-semibold">Descripción</label>
                    <textarea
                        {...register('description', {
                            maxLength: {
                                value: 1000,
                                message: 'La descripción no puede superar los 1000 caracteres',
                            },
                        })}
                        className={`p-2 border rounded-md resize-none ${
                            errors.description ? 'border-red-700' : 'border-border'
                        }`}
                        rows={4}
                    />
                    {errors.description && <p className="text-red-700 text-sm">{errors.description.message}</p>}
                </div>
            </div>

            <div className="flex w-full justify-end mt-4 gap-4">
                {isEdit && selectedMovement && (
                    <DeleteMovementButton
                        id={selectedMovement.id}
                        label={`${selectedMovement.type} de ${formatPrice(selectedMovement.amount)}`}
                    />
                )}
                <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className={`font-semibold ${isSubmitting || !isDirty ? 'cursor-not-allowed bg-muted' : 'cursor-pointer bg-secondary hover:bg-muted'} text-main border border-border py-2 px-4 rounded-md transition-all`}
                >
                    {isSubmitting ? <LoaderCircle className="animate-spin" /> : 'Guardar'}
                </button>
            </div>
        </form>
    );
}
