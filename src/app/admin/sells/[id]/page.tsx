import { getSellById } from '@/lib/services/sell';

import { formatPrice } from '@/lib/helpers/components/utils';

import ErrorMessage from '@/components/ErrorMessage';
import SellFormPayments from '@/components/sells/form/SellFormPayments';

interface SellPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SellPage({ params }: SellPageProps) {
    const { id } = await params;
    const sell = await getSellById(Number(id));

    if (!sell)
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
            <div className="p-4 md:p-8 bg-surface rounded-lg max-h-fit flex-1 xl:sticky top-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Detalles de Venta</h1>
                    <div className="mt-2">
                        <span className="text-muted mr-2">ID: #{sell.id}</span>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                sell.status === 'Pendiente'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-green-600/20 text-green-600'
                            }`}
                        >
                            {sell.status}
                        </span>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-xl md:text-2xl font-bold">Total: {formatPrice(sell.totalPrice)}</p>
                </div>
            </div>

            <div className="flex-2">
                <div className="bg-surface rounded-lg p-4 md:p-8 shadow-lg">
                    <h2 className="font-semibold mb-4">Productos</h2>
                    <div className="space-y-4">
                        {sell.items.map((item) => {
                            const quantity = item.isBox ? item.quantity / item.unitsPerBox : item.quantity;

                            return (
                                <div key={item.id} className="bg-main p-4 rounded-lg">
                                    <div className="flex justify-between items-end">
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.productName}</h3>
                                            <div className="flex flex-wrap items-center mt-2 gap-2">
                                                {item.isBox && (
                                                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                                                        Caja ({item.unitsPerBox} unidades)
                                                    </span>
                                                )}
                                                <span className="text-xs bg-muted/20 text-muted px-2 py-1 rounded">
                                                    Precio de compra: {formatPrice(item.purchasePrice)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right ml-4">
                                            <p className=" font-semibold">{formatPrice(quantity * item.unitPrice)}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                                        <div className="text-sm text-muted">
                                            Precio de venta:{' '}
                                            <span className="text-secondary">{formatPrice(item.unitPrice)}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="w-8 h-8 flex items-center justify-center bg-accent/20 text-accent rounded-full text-sm">
                                                {quantity}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <SellFormPayments
                    currentStatus={sell.status}
                    sellId={sell.id}
                    totalPrice={sell.totalPrice}
                    previousPayments={sell.payments}
                    previousNote={sell.note}
                    previousDate={sell.date}
                />
            </div>
        </div>
    );
}
