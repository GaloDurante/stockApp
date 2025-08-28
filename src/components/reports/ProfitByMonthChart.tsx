'use client';
import { useMemo, useState } from 'react';
import { formatPrice } from '@/lib/helpers/components/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Rectangle, CartesianGrid } from 'recharts';
import { ChartsData } from '@/types/report';

interface ProfitByMonthChartProps {
    data: ChartsData[];
}

export default function ProfitByMonthChart({ data }: ProfitByMonthChartProps) {
    const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);

    const topProducts = useMemo(() => {
        if (!selectedMonth) return null;
        const monthData = data.find((d) => d.month === selectedMonth);
        return monthData?.topProducts ?? null;
    }, [selectedMonth, data]);

    const maxValue = useMemo(() => Math.max(...data.map((d) => d.total)), [data]);
    const maxLabel = formatPrice(maxValue);
    const yAxisWidth = Math.max(40, maxLabel.length * 8);

    const renderTopProductsSection = () => {
        if (!selectedMonth) return <p className="text-center text-muted">Selecciona un mes para ver detalles</p>;

        if (!topProducts || topProducts.length < 1)
            return <p className="text-center text-muted">Sin ventas en {selectedMonth}</p>;

        return (
            <>
                <h4 className="text-center text-xl font-bold my-4 text-white">
                    Los 3 productos más vendidos de {selectedMonth}
                </h4>
                <ul className="space-y-2">
                    {topProducts.map((p, idx) => (
                        <li
                            key={p.productName}
                            className="flex justify-between gap-4 bg-[#2a2a2a] p-3 rounded-lg shadow"
                        >
                            <span>
                                {idx + 1}. {p.productName}
                            </span>
                            <span className="font-bold">
                                <span className="text-muted font-normal hidden md:inline">cantidad </span>
                                {p.quantity}
                            </span>
                        </li>
                    ))}
                </ul>
            </>
        );
    };

    return (
        <div className="w-full flex-1 p-4 flex flex-col">
            <ResponsiveContainer width="100%" height="60%" className="flex-2">
                <BarChart data={data} onClick={(option) => setSelectedMonth(option.activeLabel)}>
                    <CartesianGrid horizontal vertical={false} stroke="#444" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#fff" />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        stroke="#fff"
                        width={yAxisWidth}
                        tickFormatter={(value) => formatPrice(Number(value))}
                    />
                    <Tooltip
                        trigger="click"
                        cursor={{ fill: 'rgba(200, 200, 200, 0.05)' }}
                        formatter={(value) => formatPrice(Number(value))}
                        itemStyle={{ color: 'white' }}
                        contentStyle={{
                            backgroundColor: '#2a2a2a',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        }}
                    />
                    <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} activeBar={<Rectangle fill="orange" />} />
                </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 flex-1 overflow-auto">{renderTopProductsSection()}</div>
        </div>
    );
}
