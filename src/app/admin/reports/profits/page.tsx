import { getProfitByMonthForYear } from '@/lib/services/report';
import ProfitByMonthChart from '@/components/reports/ProfitByMonthChart';
import YearSelector from '@/components/reports/YearSelector';

interface ProfitsPageProps {
    searchParams: Promise<{
        year?: number;
    }>;
}

export default async function ProfitsPage({ searchParams }: ProfitsPageProps) {
    const { year } = await searchParams;

    const maxYear = new Date().getFullYear();
    const selectedYear = year ? year : maxYear;
    const result = await getProfitByMonthForYear(selectedYear);

    return (
        <div className="bg-surface p-4 rounded-lg flex flex-col h-[calc(100dvh-5rem)] md:h-[calc(100dvh-8rem)] lg:h-full">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Ganancias Totales</h1>
                <div className="min-w-32">
                    <YearSelector currentYear={selectedYear} maxYear={maxYear} />
                </div>
            </div>
            <ProfitByMonthChart data={result} />
        </div>
    );
}
