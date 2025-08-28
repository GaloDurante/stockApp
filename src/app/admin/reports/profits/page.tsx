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
    const profitByMonthData = await getProfitByMonthForYear(selectedYear);

    return (
        <div className="bg-surface p-4 rounded-lg flex flex-col h-[calc(100dvh-6rem)] md:h-[calc(100dvh-8rem)] lg:h-full custom-scrollbar">
            <div className="flex justify-between items-center pl-4 pb-4">
                <div>
                    <h1 className="text-xl md:text-3xl font-bold">Ganancias Totales</h1>
                    <p className="text-sm text-muted mt-1">Resumen anual de ingresos</p>
                </div>
                <div className="min-w-32">
                    <YearSelector currentYear={selectedYear} maxYear={maxYear} />
                </div>
            </div>
            <ProfitByMonthChart data={profitByMonthData} />
        </div>
    );
}
