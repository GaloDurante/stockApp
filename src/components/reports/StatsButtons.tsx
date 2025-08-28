import { formatPrice } from '@/lib/helpers/components/utils';
import { CircleDollarSign, ChartColumn, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface StatsButtonsProps {
    totalMoney: number;
    profitTotal: number;
}

export default function StatsButtons({ totalMoney, profitTotal }: StatsButtonsProps) {
    return (
        <>
            <div className="flex flex-col justify-center items-center order-2 md:order-3 p-6 bg-gradient-to-br from-blue-900/40 to-blue-800/30 rounded-xl border border-blue-700/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group min-h-44">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/20 mb-3 group-hover:bg-blue-500/30 transition-colors">
                    <CircleDollarSign />
                </div>
                <span className="text-sm font-medium text-blue-200 mb-1 text-center">
                    Plata invertida en inventario
                </span>
                <div className="text-2xl font-bold mt-1">{formatPrice(totalMoney)}</div>
            </div>

            <Link
                href="/admin/reports/profits"
                className="flex flex-col justify-center items-center order-4 p-6 bg-gradient-to-br from-emerald-900/40 to-emerald-800/30 rounded-xl border border-emerald-700/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group min-h-44"
            >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600/20 mb-3 group-hover:bg-emerald-500/30 transition-colors">
                    <ChartColumn />
                </div>
                <span className="text-sm font-medium text-emerald-200 mb-1 text-center">Ganancias Totales</span>
                <div className="text-2xl font-bold mt-1">{formatPrice(profitTotal)}</div>
                <div className="flex items-center mt-2 text-xs text-emerald-300">
                    <span>Ver reporte detallado</span>
                    <ChevronRight size={16} className="mt-0.5" />
                </div>
            </Link>
        </>
    );
}
