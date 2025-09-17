import { dayStart, dayEnd } from '@formkit/tempo';
import { getProfitHistoric, getTotalProductsMoney, getTotalReceivedByReceiver } from '@/lib/services/report';
import Filters from '@/components/Filters';
import ReceiverCard from '@/components/reports/ReceiverCard';
import StatsButtons from '@/components/reports/StatsButtons';

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
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Filters
                    withDateRange
                    startDate={startDate}
                    endDate={endDate}
                    withCategories
                    selectedCategory={filterByCategory}
                    showAllCategory
                    withOrder
                    orderOptions={['order-1', '', 'order-3 md:order-2', '']}
                />

                <StatsButtons totalMoney={totalProductsMoney} profitTotal={profitTotal} />
            </div>

            {receiversMoney.length > 0 && (
                <div className="">
                    <h2 className="text-xl font-semibold mb-4">Montos recibidos por cuenta</h2>

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
