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
            <div className="p-6 md:p-8 bg-surface rounded-lg max-h-fit flex-1 xl:sticky top-8 border border-border shadow-lg">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">Detalles de Venta</h1>
                    <span className="text-muted">ID: #{sell.id}</span>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 rounded-lg border border-border shadow-lg">
                        <span className="text-muted text-sm md:text-base">Total:</span>
                        <span className="text-lg md:text-xl font-bold">{formatPrice(sell.totalPrice)}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-lg border border-border shadow-lg">
                        <span className="text-muted text-sm md:text-base">Seleccionados:</span>
                        <span className="text-lg md:text-xl font-semibold">
                            {sell.items.length} {sell.items.length === 1 ? 'producto' : 'productos'}
                        </span>
                    </div>

                    {sell.items.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                            <h3 className="text-sm font-medium text-muted mb-2">Resumen:</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {sell.items.map((item) => {
                                    const quantity = item.isBox ? item.quantity / item.unitsPerBox : item.quantity;
                                    const totalItem = quantity * item.unitPrice;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center text-sm rounded-md"
                                        >
                                            <span className="truncate max-w-[70%]">{item.productName}</span>
                                            <span className="font-medium">{formatPrice(totalItem)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex justify-between items-center">
                            <span className="text-muted font-medium text-sm">Estado:</span>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    sell.status === 'Pendiente'
                                        ? 'bg-yellow-400/20 text-yellow-400'
                                        : 'bg-green-600/20 text-green-600'
                                }`}
                            >
                                {sell.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-3">
                <div className="bg-surface rounded-lg p-6 md:p-8 shadow-lg border border-border">
                    <h2 className="font-semibold mb-4">Productos</h2>
                    <div className="space-y-4">
                        {sell.items.map((item) => {
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
                                                <span className="text-xs bg-border text-muted px-3 py-1.5 rounded-md font-medium">
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
