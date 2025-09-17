import { UseFormRegister, FieldErrors, Control, Controller, UseFormWatch } from 'react-hook-form';

import { SaleFormType } from '@/types/form';

import CustomDatePicker from '@/components/CustomDatePicker';

interface SaleFormDetailsProps {
    register: UseFormRegister<SaleFormType>;
    errors: FieldErrors<SaleFormType>;
    control: Control<SaleFormType>;
    watch: UseFormWatch<SaleFormType>;
}

export default function SaleFormDetails({ control, errors, register }: SaleFormDetailsProps) {
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
        </>
    );
}
