import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { ProductSaleFormType, SaleFormType } from '@/types/form';
import { formatPrice } from '@/lib/helpers/components/utils';
import { Trash } from 'lucide-react';
import Switch from '@/components/Switch';

interface SaleFormProductsProps {
    items: ProductSaleFormType[];
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setTempSelectedItems: React.Dispatch<React.SetStateAction<ProductSaleFormType[]>>;
    setValue: UseFormSetValue<SaleFormType>;
    register: UseFormRegister<SaleFormType>;
    errors: FieldErrors<SaleFormType>;
    watch: UseFormWatch<SaleFormType>;
}

export default function SaleFormProducts({
    setIsModalOpen,
    items,
    setTempSelectedItems,
    setValue,
    register,
    errors,
    watch,
}: SaleFormProductsProps) {
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

    const handleQtyBlur =
        (index: number, stock: number, isBox: boolean, unitsPerBox: number) =>
        (e: React.FocusEvent<HTMLInputElement>) => {
            let v = e.target.valueAsNumber;
            if (!Number.isFinite(v)) v = 1;

            const maxQuantity = isBox ? Math.floor(stock / unitsPerBox) : stock;

            if (v < 1) v = 1;
            if (v > maxQuantity) v = maxQuantity;

            setValue(`items.${index}.quantity`, v, { shouldDirty: true, shouldValidate: true });
            e.currentTarget.value = String(v);
        };

    const handlePriceBlur =
        (index: number, minPrice: number, isBox: boolean, unitsPerBox: number) =>
        (e: React.FocusEvent<HTMLInputElement>) => {
            let v = e.target.valueAsNumber;
            const min = isBox ? minPrice * unitsPerBox : minPrice;

            if (!Number.isFinite(v) || v < min) v = min;

            setValue(`items.${index}.newSalePrice`, v, { shouldDirty: true, shouldValidate: true });
            e.currentTarget.value = String(v);
        };

    const toggleBoxSaleing = (index: number, currentValue: boolean) => {
        const newValue = !currentValue;
        setValue(`items.${index}.isBox`, newValue, { shouldDirty: true });

        setValue(`items.${index}.quantity`, 1, { shouldDirty: true });

        const item = items[index];
        const currentPrice = watch(`items.${index}.newSalePrice`) ?? item.salePrice;
        const minPrice = newValue ? item.purchasePrice * item.unitsPerBox : item.purchasePrice;
        const defaultPrice = newValue ? item.salePriceBox || item.salePrice * item.unitsPerBox : item.salePrice;

        if (currentPrice < minPrice) {
            setValue(`items.${index}.newSalePrice`, defaultPrice, { shouldDirty: true });
        } else if (currentPrice === (newValue ? item.salePrice : item.salePriceBox)) {
            setValue(`items.${index}.newSalePrice`, defaultPrice, { shouldDirty: true });
        }
    };

    return (
        <div className="bg-surface p-6 md:p-8 rounded-lg border border-border">
            <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-2 items-start md:flex-row md:items-center justify-between">
                    <div>
                        <h2 className="font-semibold">
                            Productos <span className="text-red-700">*</span>
                        </h2>
                        <p className="text-sm text-muted mt-1">Agregue los productos para esta venta</p>
                    </div>
                    <button
                        type="button"
                        onClick={openModal}
                        className="font-semibold cursor-pointer bg-accent hover:bg-accent-hover border border-border py-2 px-4 rounded-lg transition-all w-fit"
                    >
                        Buscar productos
                    </button>
                </div>

                {items.length > 0 && (
                    <div className="mt-4 border border-border rounded-lg shadow-lg overflow-auto max-h-[30rem] md:max-h-[50rem] custom-scrollbar">
                        <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_auto] items-center bg-border rounded-tl-md gap-4 px-4 py-2 sticky z-10 top-0 text-xs font-semibold">
                            <span>Producto</span>
                            <span className="text-center">Cantidad</span>
                            <span className="text-center">Precio de venta</span>
                            <span className="text-center">Total</span>
                            <span className="invisible">Acción</span>
                        </div>

                        {items.map((item, index) => {
                            const quantity = watch(`items.${index}.quantity`) ?? 1;
                            const salePrice = watch(`items.${index}.newSalePrice`) ?? item.salePrice;
                            const isBox = watch(`items.${index}.isBox`) ?? false;
                            const totalItem = salePrice && quantity ? quantity * salePrice : 0;
                            const availableStock = isBox ? Math.floor(item.stock / item.unitsPerBox) : item.stock;

                            const stockColor =
                                availableStock > 20
                                    ? 'bg-green-400/30 text-green-400'
                                    : availableStock > 10
                                      ? 'bg-yellow-400/30 text-yellow-400'
                                      : 'bg-red-400/30 text-red-400';

                            return (
                                <div
                                    key={item.id}
                                    className={`relative grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center gap-4 px-4 py-3 ${
                                        index !== items.length - 1 && 'border-b border-border'
                                    }`}
                                >
                                    <div className="w-10/12 sm:w-full flex flex-col gap-1">
                                        <span className="font-semibold mb-2">{item.name}</span>

                                        <span className="text-xs bg-border text-muted px-3 py-1.5 rounded-full font-medium w-fit">
                                            {isBox
                                                ? `Compra caja: ${formatPrice(item.purchasePrice * item.unitsPerBox)}`
                                                : `Compra unidad: ${formatPrice(item.purchasePrice)}`}
                                        </span>

                                        <span className="text-xs bg-accent/30 text-accent px-3 py-1.5 rounded-full font-medium w-fit">
                                            {isBox
                                                ? `Venta caja: ${formatPrice(item.salePriceBox || item.salePrice * item.unitsPerBox)}`
                                                : `Venta unidad: ${formatPrice(item.salePrice)}`}
                                        </span>

                                        <span
                                            className={`text-xs ${stockColor} px-3 py-1.5 rounded-full font-medium w-fit`}
                                        >
                                            Stock:{' '}
                                            {isBox
                                                ? `${availableStock} cajas (${item.stock} unidades)`
                                                : `${item.stock} unidades`}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted">
                                                {isBox ? `Caja (${item.unitsPerBox}u)` : 'Unidad'}
                                            </span>
                                            <Switch
                                                disabled={!!(item.stock < item.unitsPerBox)}
                                                checked={isBox}
                                                onChange={() => toggleBoxSaleing(index, isBox)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[auto_1fr] md:block items-center gap-2">
                                        <span className="md:hidden text-sm text-muted">Cantidad:</span>
                                        <div className="flex md:justify-center">
                                            <input
                                                type="number"
                                                min={1}
                                                max={availableStock}
                                                className="border border-border rounded-md p-1 w-16 text-center"
                                                {...register(`items.${index}.quantity`, {
                                                    valueAsNumber: true,
                                                    value: item.quantity ?? 1,
                                                })}
                                                onBlur={handleQtyBlur(index, item.stock, isBox, item.unitsPerBox)}
                                                onWheel={(e) => e.currentTarget.blur()}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[auto_1fr] md:block items-center gap-2">
                                        <span className="md:hidden text-sm text-muted">Precio:</span>
                                        <div className="flex md:justify-center">
                                            <div className="relative">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2">$</span>
                                                <input
                                                    type="number"
                                                    min={
                                                        isBox
                                                            ? item.purchasePrice * item.unitsPerBox
                                                            : item.purchasePrice
                                                    }
                                                    className="border border-border rounded-md p-1 pl-6 w-24 no-spinner"
                                                    {...register(`items.${index}.newSalePrice`, {
                                                        valueAsNumber: true,
                                                        value: isBox
                                                            ? item.salePriceBox || item.salePrice * item.unitsPerBox
                                                            : item.salePrice,
                                                    })}
                                                    onBlur={handlePriceBlur(
                                                        index,
                                                        item.purchasePrice,
                                                        isBox,
                                                        item.unitsPerBox
                                                    )}
                                                    defaultValue={
                                                        isBox
                                                            ? item.salePriceBox || item.salePrice * item.unitsPerBox
                                                            : item.salePrice
                                                    }
                                                    onWheel={(e) => e.currentTarget.blur()}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[auto_1fr] md:block items-center gap-2">
                                        <span className="md:hidden text-sm text-muted">Total:</span>
                                        <div className="flex md:justify-center">
                                            <span className="font-medium">{formatPrice(totalItem)}</span>
                                        </div>
                                    </div>

                                    <div className="absolute top-3 right-3 md:static flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            aria-label={`Eliminar ${item.name}`}
                                            className="p-1 md:p-2 hover:bg-red-200 hover:text-red-700 rounded-full transition-all cursor-pointer"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
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
