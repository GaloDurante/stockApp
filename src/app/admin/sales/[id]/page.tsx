import { getSaleById } from '@/lib/services/sale';

import { formatPrice } from '@/lib/helpers/components/utils';

import { SaleProvider } from '@/context/SaleContext';

import ErrorMessage from '@/components/ErrorMessage';
import SaleFormPayments from '@/components/sales/form/SaleFormPayments';
import SaleDetailsPanel from '@/components/sales/SaleDetailsPanel';

interface SalePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SalePage({ params }: SalePageProps) {
    const { id } = await params;
    const sale = await getSaleById(Number(id));

    if (!sale)
        return (
            <ErrorMessage
                title={'Venta no encontrada'}
                text={
                    'Lo sentimos, no pudimos encontrar la venta que buscás. Por favor, verifica el ID o intenta nuevamente más tarde.'
                }
            />
        );

    return (
        <div className="flex flex-col xl:flex-row-reverse gap-8">
            <SaleProvider
                initialTotal={sale.totalPrice}
                initialShipping={sale.shippingPrice}
                initialSupplierCoveredAmount={sale.supplierCoveredAmount}
            >
                <SaleDetailsPanel sale={sale} />
                <div className="flex-3">
                    <div className="bg-surface rounded-lg p-6 md:p-8 shadow-lg border border-border">
                        <h2 className="font-semibold mb-4">Productos</h2>
                        <div className="space-y-4">
                            {sale.items.map((item) => {
                                const quantity = item.isBox ? item.quantity / item.unitsPerBox : item.quantity;

                                return (
                                    <div
                                        key={item.id}
                                        className="border border-border p-4 rounded-lg bg-surface mb-6 shadow-lg"
                                    >
                                        <div className="flex flex-col justify-between md:flex-row">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg mb-2">{item.productName}</h3>
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    {item.isBox && (
                                                        <span className="text-xs bg-accent/30 text-accent px-3 py-1.5 rounded-md font-medium">
                                                            Caja ({item.unitsPerBox} unidades)
                                                        </span>
                                                    )}
                                                    <span className="text-xs bg-border text-muted px-3 py-1.5 rounded-full font-medium">
                                                        Precio de compra: {formatPrice(item.purchasePrice)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-xl font-bold">
                                                    {formatPrice(quantity * item.unitPrice)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 mt-3 border-t border-border">
                                            <p className="text-sm text-muted">
                                                Precio de venta:{' '}
                                                <span className="text-accent font-medium">
                                                    {formatPrice(item.unitPrice)}
                                                </span>
                                            </p>

                                            <div className="flex items-center">
                                                <span className="w-9 h-9 flex items-center justify-center bg-accent/30 text-accent rounded-full font-medium">
                                                    {quantity}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <SaleFormPayments saleData={sale} />
                </div>
            </SaleProvider>
        </div>
    );
}
