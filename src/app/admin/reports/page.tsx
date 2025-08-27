import { dayStart, dayEnd } from '@formkit/tempo';
import { getProfitHistoric, getTotalProductsMoney, getTotalReceivedByReceiver } from '@/lib/services/report';
import { formatPrice } from '@/lib/helpers/components/utils';
import Filters from '@/components/Filters';
import ReceiverCard from '@/components/reports/ReceiverCard';
import Link from 'next/link';

interface ReportsPageProps {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
        filterByCategory?: string;
    }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
    const { startDate, endDate, filterByCategory } = await searchParams;

    const [profitTotal, totalProductsMoney, receiversMoney] = await Promise.all([
        getProfitHistoric({
            start: startDate ? dayStart(startDate) : undefined,
            end: endDate ? dayEnd(endDate) : undefined,
        }),
        getTotalProductsMoney(filterByCategory),
        getTotalReceivedByReceiver(),
    ]);

    return (
        <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Filters
                    withDateRange
                    startDate={startDate}
                    endDate={endDate}
                    withCategories
                    selectedCategory={filterByCategory}
                    showAllCategory
                    withOrder
                    orderOptions={['order-1', '', 'order-3 md:order-2']}
                />

                <div className="flex flex-col justify-center items-center order-2 md:order-3 mb-10 md:mb-0 p-4 bg-accent-hover rounded-lg min-h-40">
                    <span>Plata actual en Productos</span>
                    <div className="text-2xl font-bold">{formatPrice(totalProductsMoney)}</div>
                </div>

                <Link
                    href="/admin/reports/profits"
                    className="flex flex-col justify-center items-center order-4 p-4 bg-accent-hover rounded-lg min-h-40"
                >
                    <span>Ganancias Totales</span>
                    <div className="text-2xl font-bold">{formatPrice(profitTotal)}</div>
                </Link>
            </div>

            {receiversMoney.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-6 pb-2">Montos recibidos por cuenta</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {receiversMoney.map((r, index) => {
                            const total = receiversMoney.reduce((sum, item) => sum + item.total, 0);
                            const percentage = total > 0 ? ((r.total / total) * 100).toFixed(1) : 0;
                            return <ReceiverCard key={index} r={r} percentage={percentage} />;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
