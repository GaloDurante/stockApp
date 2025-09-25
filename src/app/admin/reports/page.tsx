import { dayStart, dayEnd } from '@formkit/tempo';
import { getProfitHistoric, getTotalProductsMoney, getAccountBalances } from '@/lib/services/report';
import { formatPrice } from '@/lib/helpers/components/utils';

import { Wallet } from 'lucide-react';
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

    const [profitTotal, totalProductsMoney, balances] = await Promise.all([
        getProfitHistoric({
            start: startDate ? dayStart(startDate) : undefined,
            end: endDate ? dayEnd(endDate) : undefined,
        }),
        getTotalProductsMoney(filterByCategory),
        getAccountBalances(),
    ]);

    const receiversMoney = Object.entries(balances).map(([receiver, total]) => ({
        receiver,
        total,
    }));
    const totalMoney = receiversMoney.reduce((sum, item) => sum + item.total, 0);

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

            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Saldo total</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-surface p-4 md:p-6 rounded-lg border border-border">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-green-600/30`}>
                            <Wallet size={20} className="text-green-600" />
                        </div>
                        <div className="mt-4">
                            <div className="text-sm text-muted">Saldo total disponible</div>
                            <div className="text-2xl font-bold">{formatPrice(totalMoney)}</div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">
                                    Distribuido en {receiversMoney.length} cuenta
                                    {receiversMoney.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {receiversMoney.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Saldos por cuenta</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {receiversMoney.map((r, index) => {
                            return <ReceiverCard key={index} r={r} />;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
