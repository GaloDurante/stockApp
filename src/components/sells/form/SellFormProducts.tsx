import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';

import { ProductSellFormType, SellFormType } from '@/types/form';
import { formatPrice } from '@/lib/helpers/components/utils';

import { X } from 'lucide-react';

interface SellFormProductsProps {
    items: ProductSellFormType[];
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setTempSelectedItems: React.Dispatch<React.SetStateAction<ProductSellFormType[]>>;
    setValue: UseFormSetValue<SellFormType>;
    register: UseFormRegister<SellFormType>;
    errors: FieldErrors<SellFormType>;
    watch: UseFormWatch<SellFormType>;
}

export default function SellFormProducts({
    setIsModalOpen,
    items,
    setTempSelectedItems,
    setValue,
    register,
    errors,
    watch,
}: SellFormProductsProps) {
    const openModal = () => {
        setTempSelectedItems(
            items.map((item) => ({
                ...item,
                quantity: item.quantity ?? 1,
            }))
        );
        setIsModalOpen(true);
    };

    const handleRemoveItem = (id: number) => {
        const newItems = items.filter((item) => item.id !== id);
        setValue('items', newItems, { shouldDirty: true });
    };

    return (
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
                                        <span className="block mt-2 text-sm text-muted">{formatPrice(item.price)}</span>
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
            </div>
        </div>
    );
}
