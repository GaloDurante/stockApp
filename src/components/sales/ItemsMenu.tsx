import { useState } from 'react';

import { SaleItemType } from '@/types/saleItem';
import { formatQuantity, formatPrice } from '@/lib/helpers/components/utils';

import { Bike, ChevronDown, ShoppingCartIcon, X, HandCoins } from 'lucide-react';
import Link from 'next/link';
import Modal from '@/components/Modal';

interface ItemsMenuProps {
    items: SaleItemType[];
    shippingPrice: number;
    supplierCoveredAmount: number;
}

export default function ItemsMenu({ items, shippingPrice = 0, supplierCoveredAmount = 0 }: ItemsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="hidden rounded-md md:flex items-end p-2 cursor-pointer hover:bg-accent transition-all group relative"
            >
                {formatQuantity(items.length)}
                <span className="opacity-0 group-hover:opacity-100">
                    <ChevronDown height={18} />
                </span>
            </button>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex gap-1 text-sm font-semibold cursor-pointer"
            >
                <ShoppingCartIcon className="w-4 h-4" />
                {formatQuantity(items.length)}
            </button>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <div className="flex justify-between items-center p-4 border-b border-border bg-main rounded-t-xl">
                        <span id="modal-title" className="text-lg font-semibold">
                            Detalles de los items
                        </span>
                        <button type="button" onClick={() => setIsOpen(false)}>
                            <X className="h-7 w-7 p-1 hover:bg-border rounded-full cursor-pointer transition-all" />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-grow max-h-[60vh]">
                        {items.map((item, index) => {
                            const quantity = item.isBox ? item.quantity / item.unitsPerBox : item.quantity;

                            return (
                                <div
                                    key={item.id}
                                    className={`p-4 border-border flex justify-between items-center gap-4 ${
                                        index !== items.length - 1 ? 'border-b' : ''
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        {item.productId ? (
                                            <Link
                                                href={`/admin/products/${item.productId}`}
                                                className="hover:underline font-medium"
                                            >
                                                {item.productName}
                                            </Link>
                                        ) : (
                                            <span className="font-medium">{item.productName}</span>
                                        )}

                                        <span className="text-sm text-muted mt-2">
                                            x {quantity}{' '}
                                            {item.isBox
                                                ? quantity === 1
                                                    ? `caja (${item.unitsPerBox} u)`
                                                    : `cajas (${item.unitsPerBox} u c/u)`
                                                : quantity === 1
                                                  ? 'unidad'
                                                  : 'unidades'}
                                        </span>
                                    </div>

                                    <div className="font-semibold text-base">{formatPrice(item.unitPrice)}</div>
                                </div>
                            );
                        })}

                        <div className={`p-4 border-t border-border flex justify-between items-center`}>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-terciary/30 rounded-full shadow-sm">
                                    <Bike className="h-5 w-5 text-terciary" />
                                </div>
                                <span className="font-medium">Costo de envío</span>
                            </div>
                            <div className="font-semibold text-base">{formatPrice(shippingPrice)}</div>
                        </div>
                        <div className={`p-4 border-t border-border flex justify-between items-center`}>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-accent/30 rounded-full shadow-sm">
                                    <HandCoins className="h-5 w-5 text-accent" />
                                </div>
                                <span className="font-medium">Contribución del envío</span>
                            </div>
                            <div className={`font-semibold text-base ${supplierCoveredAmount > 0 && 'text-red-700'}`}>
                                {supplierCoveredAmount > 0 ? (
                                    <>- {formatPrice(supplierCoveredAmount)}</>
                                ) : (
                                    formatPrice(0)
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
