import { useState } from 'react';

import { SellType } from '@/types/sell';
import { formatPrice } from '@/lib/helpers/components/utils';

import { ChevronDown, X, CreditCard, Banknote } from 'lucide-react';
import Modal from '@/components/Modal';

interface SellMoreDetailsProps {
    sell: SellType;
}

const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
        case 'efectivo':
            return (
                <div className="p-2 border border-green-600 rounded-full shadow-sm">
                    <Banknote className="h-5 w-5 text-green-600" />
                </div>
            );
        case 'transferencia':
            return (
                <div className="p-2 border border-accent rounded-full shadow-sm">
                    <CreditCard className="h-5 w-5 text-accent" />
                </div>
            );
        default:
            return (
                <div className="p-2 border border-terciary rounded-full shadow-sm">
                    <Banknote className="h-5 w-5 text-terciary" />
                </div>
            );
    }
};

export default function SellMoreDetails({ sell }: SellMoreDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="hidden rounded-md md:flex items-end p-2 cursor-pointer hover:bg-accent transition-all group relative"
            >
                Ver más
                <span className="opacity-0 group-hover:opacity-100">
                    <ChevronDown height={18} />
                </span>
            </button>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden flex text-sm underline underline-offset-2 cursor-pointer w-fit"
            >
                Ver detalles
            </button>

            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <div className="flex justify-between items-center p-4 border-b border-border bg-main rounded-t-xl">
                        <span id="modal-title" className="text-lg font-semibold">
                            Métodos de pago
                        </span>
                        <button type="button" onClick={() => setIsOpen(false)}>
                            <X className="h-7 w-7 p-1 hover:bg-border rounded-full cursor-pointer transition-all" />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-grow max-h-[60vh]">
                        {sell.payments.map((payment) => (
                            <div key={payment.id} className="p-4 border-b border-border">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {getPaymentIcon(payment.method)}
                                        <div>
                                            <p className="font-medium capitalize">{payment.method}</p>
                                            {payment.receiver && (
                                                <p className="text-sm mt-1 text-muted">{payment.receiver}</p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-base">{formatPrice(payment.amount)}</p>
                                </div>
                            </div>
                        ))}

                        <div className="p-4">
                            <h3 className="font-medium  mb-2">Resumen de pagos</h3>
                            <div className="flex justify-between text-sm">
                                <span>Total pagado:</span>
                                <span className="font-medium text-base">
                                    {formatPrice(sell.payments.reduce((sum, payment) => sum + payment.amount, 0))}
                                </span>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
