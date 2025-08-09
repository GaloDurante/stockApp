import { format } from '@formkit/tempo';

import { SellType } from '@/types/sell';

interface SellsTableType {
    sells: SellType[];
}

export default function SellsTable({ sells }: SellsTableType) {
    return (
        <div className="relative w-full overflow-auto rounded-lg max-h-[calc(100vh-22rem)] md:max-h-[calc(100vh-24rem)] lg:max-h-[calc(100vh-12rem)] custom-scrollbar">
            <table className="min-w-full border-t-2 border border-border bg-surface text-sm">
                <thead className="bg-border sticky -top-[1px]">
                    <tr className="text-left uppercase text-xs tracking-wider">
                        <th className="p-4 w-[5%]">ID</th>
                        <th className="p-4 w-[20%]">Fecha</th>
                        <th className="p-4 w-[15%]">Precio Total</th>
                        <th className="p-4 w-[10%]">Items</th>
                        <th className="p-4 w-[15%]">Método Pago</th>
                        <th className="p-4 w-[15%]">Receptor</th>
                    </tr>
                </thead>
                <tbody>
                    {sells.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center py-6 text-muted">
                                No hay ventas para mostrar.
                            </td>
                        </tr>
                    ) : (
                        sells.map((sell) => (
                            <tr key={sell.id} className="border-t border-border hover:bg-border-dark transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">#{sell.id}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {format({ date: sell.date, format: 'DD/MM/YYYY', tz: 'UTC' })}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">${(sell.totalPrice / 100).toFixed(2)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{sell.items.length} items</td>
                                <td className="px-4 py-3 whitespace-nowrap">{sell.paymentMethod}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{sell.receiver}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
