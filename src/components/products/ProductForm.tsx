'use client';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { ProductFormType } from '@/types/form';
import { ProductType } from '@/types/product';
import { Category } from '@/generated/prisma';
import { LoaderCircle } from 'lucide-react';

import { createProductAction, updateProductAction } from '@/lib/actions/product';

import CustomSelect from '@/components/CustomSelect';
import { showSuccessToast, showErrorToast } from '@/components/Toast';

interface ProductFormTypeProp {
    selectedProduct?: ProductType;
    isEdit?: boolean;
}

export default function ProductForm({ selectedProduct, isEdit = false }: ProductFormTypeProp) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<ProductFormType>({
        defaultValues:
            isEdit && selectedProduct
                ? {
                      name: selectedProduct.name,
                      category: selectedProduct.category,
                      purchasePrice: selectedProduct.purchasePrice,
                      salePrice: selectedProduct.salePrice ?? undefined,
                      salePriceBox: selectedProduct.salePriceBox ?? undefined,
                      stock: selectedProduct.stock,
                      description: selectedProduct.description ?? undefined,
                      unitsPerBox: selectedProduct.unitsPerBox ?? undefined,
                  }
                : {
                      stock: 0,
                      unitsPerBox: 6,
                  },
    });

    const categoriesOptions = Object.entries(Category).map(([key, value]) => ({
        value: key,
        label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace('_', ' '),
    }));

    const onSubmit = async (data: ProductFormType) => {
        if (isEdit && selectedProduct) {
            try {
                await updateProductAction(data, selectedProduct.id);
                showSuccessToast('Producto actualizado con éxito');
                router.refresh();
            } catch {
                showErrorToast('No se pudo actualizar el producto');
            }
        } else {
            try {
                await createProductAction(data);
                showSuccessToast('Producto creado con éxito');
                router.push('/admin/products');
            } catch {
                showErrorToast('No se pudo crear el producto');
            }
        }
    };

    const purchasePrice = watch('purchasePrice');

    useEffect(() => {
        if (!isEdit && !isNaN(Number(purchasePrice))) {
            setValue('salePrice', Number(purchasePrice));
            setValue('salePriceBox', Number(purchasePrice) * 6);
        }
    }, [purchasePrice, setValue, isEdit]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-surface border border-border rounded-lg p-4 md:p-8">
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

                <div className="flex flex-col gap-0 justify-between md:flex-row md:gap-4">
                    <div className="flex flex-col gap-1 mb-4 w-full">
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

                    <div className="flex flex-col gap-1 mb-4 w-full">
                        <label>Unidades por caja</label>
                        <input
                            type="number"
                            {...register('unitsPerBox', {
                                valueAsNumber: true,
                                min: {
                                    value: 1,
                                    message: 'Las unidades no pueden ser menor a 1',
                                },
                            })}
                            className={`p-2 border rounded-md no-spinner ${errors.unitsPerBox ? 'border-red-700' : 'border-border'}`}
                        />
                        {errors.unitsPerBox && <p className="text-red-700 text-sm">{errors.unitsPerBox.message}</p>}
                    </div>
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
                                />
                            );
                        }}
                    />
                    {errors.category && <p className="text-red-700 text-sm">{errors.category.message}</p>}
                </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4 md:p-8 mt-4">
                <div className="flex flex-col gap-1 mb-4 w-full">
                    <label>
                        Precio unitario <span className="text-red-700">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2">$</span>
                        <input
                            type="number"
                            {...register('purchasePrice', {
                                required: 'El precio es obligatorio',
                                valueAsNumber: true,
                                min: {
                                    value: 0,
                                    message: 'El precio no puede ser menor a 0',
                                },
                            })}
                            className={`p-2 pl-6 border rounded-md no-spinner w-full ${errors.purchasePrice ? 'border-red-700' : 'border-border'}`}
                        />
                    </div>
                    {errors.purchasePrice && <p className="text-red-700 text-sm">{errors.purchasePrice.message}</p>}
                </div>

                <div className="flex flex-col gap-1 mb-4 w-full">
                    <label>
                        Precio de venta <span className="text-red-700">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2">$</span>
                        <input
                            type="number"
                            {...register('salePrice', {
                                required: 'El precio de venta es obligatorio',
                                valueAsNumber: true,
                                min: {
                                    value: watch('purchasePrice') ?? 0,
                                    message: 'El precio de venta no puede ser menor al precio de compra',
                                },
                            })}
                            className={`p-2 pl-6 border rounded-md no-spinner w-full ${errors.salePrice ? 'border-red-700' : 'border-border'}`}
                        />
                    </div>
                    {errors.salePrice && <p className="text-red-700 text-sm">{errors.salePrice.message}</p>}
                </div>

                <div className="flex flex-col gap-1 mb-4 w-full">
                    <label>Precio de venta en caja</label>
                    <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2">$</span>
                        <input
                            type="number"
                            {...register('salePriceBox', {
                                valueAsNumber: true,
                                min: {
                                    value: (purchasePrice ?? 0) * 6,
                                    message:
                                        'El precio de venta en caja no puede ser menor al precio de compra multiplicado por 6 unidades',
                                },
                            })}
                            className={`p-2 pl-6 border rounded-md no-spinner w-full ${errors.salePriceBox ? 'border-red-700' : 'border-border'}`}
                        />
                    </div>
                    {errors.salePriceBox && <p className="text-red-700 text-sm">{errors.salePriceBox.message}</p>}
                </div>
            </div>

            <div className="flex w-full justify-end mt-4">
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
