import { format } from '@formkit/tempo';

import { SellType } from '@/types/sell';
import { formatPrice, formatQuantity } from '@/lib/helpers/components/utils';

import TableActionsButtons from '@/components/products/TableActionsButtons';

interface SellCardType {
    sell: SellType;
    className?: string;
    handleDelete: () => void;
    deleteModalId: number | null;
    setDeleteModalId: (id: number | null) => void;
}

export default function SellCard({ sell, className, handleDelete, deleteModalId, setDeleteModalId }: SellCardType) {
    return (
        <div className={`bg-surface p-4 flex items-start justify-between ${className || ''}`}>
            <div className="flex flex-col gap-2">
                <span className="text-base font-medium">#{sell.id}</span>

                <div className="flex gap-3 text-sm text-muted">
                    {format({ date: sell.date, format: 'DD/MM/YYYY', tz: 'UTC' })}
                    <span>•</span>
                    <span>{formatQuantity(sell.items.length)}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="flex gap-1">
                        {Array.from(new Set(sell.payments.map((p) => p.method))).map((method, index) => (
                            <span
                                key={index}
                                className={`${method === 'Cash' ? 'border-green-600 text-green-600' : 'border-accent text-accent'} text-xs border p-2 rounded-xl font-medium`}
                            >
                                {method}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        {sell.payments.map((payment) => {
                            if (!payment.receiver) return;

                            return (
                                <span
                                    key={payment.id}
                                    className={`text-xs border border-orange-600 text-orange-600 p-2 rounded-xl font-medium`}
                                >
                                    {payment.receiver}
                                </span>
                            );
                        })}
                    </div>
                </div>

                <span className="text-sm font-semibold">{formatPrice(sell.totalPrice)}</span>
            </div>
            <div className="flex items-center gap-2">
                <TableActionsButtons
                    redirect={`/admin/sells/${sell.id}`}
                    handleDelete={handleDelete}
                    label={`la venta ID #${sell.id}`}
                    isModalOpen={deleteModalId === sell.id}
                    openModal={() => setDeleteModalId(sell.id)}
                    closeModal={() => setDeleteModalId(null)}
                    isTwoStep
                    confirmationText={`Venta-ID-${sell.id}`}
                    hideEditButton
                />
            </div>
        </div>
    );
}
