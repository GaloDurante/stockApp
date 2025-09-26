'use client';
import { formatPrice } from '@/lib/helpers/components/utils';
import { useSaleContext } from '@/context/SaleContext';
import { SaleType } from '@/types/sale';

export default function SaleDetailsPanel({ sale }: { sale: SaleType }) {
    const { totalPrice, shippingPrice, supplierCoveredAmount } = useSaleContext();

    return (
        <div className="p-6 md:p-8 bg-surface rounded-lg max-h-fit flex-1 xl:sticky top-8 border border-border shadow-lg">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Detalles de Venta</h1>
                <span className="text-muted">ID: #{sale.id}</span>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg border border-border shadow-lg">
                    <span className="text-muted text-sm md:text-base">Total:</span>
                    <span className="text-lg font-bold">{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex justify-between items-center p-4 rounded-lg border border-border shadow-lg">
                    <span className="text-muted text-sm md:text-base">Seleccionados:</span>
                    <span className="text-lg font-semibold">
                        {sale.items.length} {sale.items.length === 1 ? 'producto' : 'productos'}
                    </span>
                </div>

                {sale.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                        <h3 className="text-sm font-medium text-muted mb-2">Resumen:</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {sale.items.map((item) => {
                                const quantity = item.isBox ? item.quantity / item.unitsPerBox : item.quantity;
                                const totalItem = quantity * item.unitPrice;

                                return (
                                    <div key={item.id} className="flex justify-between items-center text-sm rounded-md">
                                        <span className="truncate max-w-[70%]">{item.productName}</span>
                                        <span className="font-medium">{formatPrice(totalItem)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {shippingPrice !== null && (
                    <div className="flex justify-between text-sm">
                        <span>Envío</span>
                        <span className="font-medium">{formatPrice(shippingPrice - (supplierCoveredAmount ?? 0))}</span>
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between items-center">
                        <span className="text-muted font-medium text-sm">Estado:</span>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                sale.status === 'Pendiente'
                                    ? 'bg-yellow-400/20 text-yellow-400'
                                    : 'bg-green-600/20 text-green-600'
                            }`}
                        >
                            {sale.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
