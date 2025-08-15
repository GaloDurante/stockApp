import { useState } from 'react';

import { SellItemType } from '@/types/sellItem';
import { formatQuantity, formatPrice } from '@/lib/helpers/components/utils';

import { ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import Modal from '@/components/Modal';

interface ItemsMenuProps {
    items: SellItemType[];
}

export default function ItemsMenu({ items }: ItemsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-md flex items-end p-2 cursor-pointer hover:bg-accent transition-all group relative"
            >
                {formatQuantity(items.length)}
                <span className="opacity-0 group-hover:opacity-100">
                    <ChevronDown height={18} />
                </span>
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
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`p-4 border-border flex justify-between ${
                                    index !== items.length - 1 ? 'border-b' : ''
                                }`}
                            >
                                {item.productId ? (
                                    <Link href={`/admin/products/${item.productId}`} className="hover:underline">
                                        {item.productName}
                                    </Link>
                                ) : (
                                    <span>{item.productName}</span>
                                )}
                                <div className="flex flex-col items-end gap-2">
                                    {item.isBox ? (
                                        <span>
                                            x {item.quantity / 6} {item.quantity / 6 === 1 ? 'caja' : 'cajas'}
                                        </span>
                                    ) : (
                                        <span>
                                            x {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'}
                                        </span>
                                    )}
                                    <span className="font-semibold text-base">{formatPrice(item.unitPrice)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    );
}
