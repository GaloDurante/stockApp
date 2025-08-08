'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { ProductFormType } from '@/types/form';
import { Category } from '@/generated/prisma';
import { LoaderCircle } from 'lucide-react';

import { createProductAction } from '@/lib/actions/product';

import CustomSelect from '@/components/CustomSelect';
import { showSuccessToast, showErrorToast } from '@/components/Toast';

export default function ProductForm() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ProductFormType>();

    const categoriesOptions = Object.entries(Category).map(([key, value]) => ({
        value: key,
        label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace('_', ' '),
    }));

    const onSubmit = async (data: ProductFormType) => {
        setIsLoading(true);
        try {
            await createProductAction(data);
            showSuccessToast('Producto creado con éxito');
            router.push('/admin/products');
        } catch {
            showErrorToast('No se pudo crear el producto');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border rounded-lg p-4 md:p-8">
            <div className="flex flex-col gap-1 mb-4">
                <label>
                    Nombre <span className="text-red-700">*</span>
                </label>
                <input
                    type="text"
                    {...register('name', { required: 'El nombre es obligatorio' })}
                    className={`p-2 border rounded-md ${errors.name ? 'border-red-700' : 'border-border'}`}
                />
                {errors.name && <p className="text-red-700 text-sm">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1 mb-4">
                <label>Descripción</label>
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

            <div className="flex flex-col gap-1 mb-4">
                <label>
                    Stock <span className="text-red-700">*</span>
                </label>
                <input
                    type="number"
                    {...register('stock', {
                        required: 'El stock es obligatorio',
                        valueAsNumber: true,
                        min: {
                            value: 0,
                            message: 'El stock no puede ser menor a 0',
                        },
                    })}
                    className={`p-2 border rounded-md no-spinner ${errors.stock ? 'border-red-700' : 'border-border'}`}
                />
                {errors.stock && <p className="text-red-700 text-sm">{errors.stock.message}</p>}
            </div>

            <div className="flex flex-col gap-1 mb-4">
                <label>
                    Precio <span className="text-red-700">*</span>
                </label>
                <input
                    type="number"
                    {...register('price', {
                        required: 'El precio es obligatorio',
                        valueAsNumber: true,
                        min: {
                            value: 0,
                            message: 'El precio no puede ser menor a 0',
                        },
                    })}
                    className={`p-2 border rounded-md no-spinner ${errors.price ? 'border-red-700' : 'border-border'}`}
                />
                {errors.price && <p className="text-red-700 text-sm">{errors.price.message}</p>}
            </div>

            <div className="flex flex-col gap-1 mb-4">
                <label>
                    Categoría <span className="text-red-700">*</span>
                </label>
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: 'Debe seleccionar una categoría' }}
                    render={({ field }) => {
                        const selectedValue = categoriesOptions.find((option) => option.value === field.value);

                        return (
                            <CustomSelect
                                instanceId="category"
                                value={selectedValue || null}
                                options={categoriesOptions}
                                onChange={(newValue) => {
                                    field.onChange((newValue as { value: string }).value);
                                }}
                                isError={!!errors.category}
                                placeholder="Selecciona una categoría"
                                menuPlacement="top"
                            />
                        );
                    }}
                />
                {errors.category && <p className="text-red-700 text-sm">{errors.category.message}</p>}
            </div>

            <div className="flex w-full justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`font-semibold ${isLoading ? 'cursor-not-allowed bg-muted' : 'cursor-pointer bg-secondary hover:bg-muted'} text-main border border-border py-2 px-4 rounded-md transition-all`}
                >
                    {isLoading ? <LoaderCircle className="animate-spin" /> : 'Guardar'}
                </button>
            </div>
        </form>
    );
}
