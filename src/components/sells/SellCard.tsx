import { format } from '@formkit/tempo';

import { SellType } from '@/types/sell';
import { formatPrice, formatQuantity } from '@/lib/helpers/components/utils';

// import TableActionsButtons from '@/components/products/TableActionsButtons';

interface SellCardType {
    sell: SellType;
    className?: string;
}

export default function SellCard({ sell, className }: SellCardType) {
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
                    <span className="px-2 py-1 bg-accent text-sm rounded-lg">{sell.paymentMethod}</span>
                    {sell.receiver && <span className="px-2 py-1 text-sm bg-accent rounded-lg">{sell.receiver}</span>}
                </div>

                <span className="text-sm font-semibold">{formatPrice(sell.totalPrice)}</span>
            </div>
            {/* <div className="flex items-center gap-2">
                <TableActionsButtons row={sell} />
            </div> */}
        </div>
    );
}
