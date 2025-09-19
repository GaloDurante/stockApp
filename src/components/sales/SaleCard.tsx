import { format } from '@formkit/tempo';

import { SaleType } from '@/types/sale';
import { formatPrice } from '@/lib/helpers/components/utils';

import TableActionsButtons from '@/components/products/TableActionsButtons';
import SaleMoreDetails from '@/components/sales/SaleMoreDetails';
import ItemsMenu from '@/components/sales/ItemsMenu';

interface SaleCardType {
    sale: SaleType;
    className?: string;
    handleDelete: () => void;
    deleteModalId: number | null;
    setDeleteModalId: (id: number | null) => void;
}

export default function SaleCard({ sale, className, handleDelete, deleteModalId, setDeleteModalId }: SaleCardType) {
    return (
        <div className={`bg-surface p-4 flex items-start justify-between ${className || ''}`}>
            <div className="flex flex-col gap-2">
                <span className="font-medium">#{sale.id}</span>

                <div className="flex gap-3 text-sm text-muted">
                    {format({ date: sale.date, format: 'DD/MM/YYYY', tz: 'UTC' })}
                    <span>•</span>
                    <div className="text-secondary">
                        <ItemsMenu items={sale.items} shippingPrice={sale.shippingPrice ?? 0} />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="flex gap-1 flex-wrap">
                        {Array.from(new Set(sale.payments.map((p) => p.method))).map((method, index) => (
                            <span
                                key={index}
                                className={`${method === 'Efectivo' ? 'bg-green-600/30 text-green-600' : 'bg-accent/30 text-accent'} text-xs px-3 py-1.5 rounded-full font-medium`}
                            >
                                {method}
                            </span>
                        ))}
                        {sale.shippingPrice ? (
                            <span className="px-3 py-1.5 bg-terciary/30 text-terciary text-xs font-medium rounded-full">
                                Envío incluido
                            </span>
                        ) : (
                            <span className="px-3 py-1.5 bg-muted/30 text-muted text-xs font-medium rounded-full">
                                Sin envío
                            </span>
                        )}
                    </div>
                </div>

                <SaleMoreDetails sale={sale} />
                <span className="font-semibold">{formatPrice(sale.totalPrice)}</span>
            </div>
            <div className="flex items-center gap-2">
                <TableActionsButtons
                    redirect={`/admin/sales/${sale.id}`}
                    handleDelete={handleDelete}
                    label={`la venta ID #${sale.id}`}
                    isModalOpen={deleteModalId === sale.id}
                    openModal={() => setDeleteModalId(sale.id)}
                    closeModal={() => setDeleteModalId(null)}
                    isTwoStep
                    confirmationText={`Venta-ID-${sale.id}`}
                />
            </div>
        </div>
    );
}
