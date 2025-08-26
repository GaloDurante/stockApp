import { dayStart, dayEnd } from '@formkit/tempo';
import { getProfitHistoric } from '@/lib/services/report';
import Filters from '@/components/Filters';

interface ReportsPageProps {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
    }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
    const { startDate, endDate } = await searchParams;

    const profitTotal = await getProfitHistoric({
        start: startDate ? dayStart(startDate) : undefined,
        end: endDate ? dayEnd(endDate) : undefined,
    });

    return (
        <div>
            <div>
                <Filters withDateRange startDate={startDate} endDate={endDate} />
            </div>
            <div>
                <span>Ganancias totales: </span>
                {profitTotal}
            </div>
        </div>
    );
}
