'use client';
import { useMemo, useState } from 'react';
import { formatPrice } from '@/lib/helpers/components/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Rectangle, CartesianGrid } from 'recharts';
import { ChartsData } from '@/types/report';

interface ProfitByMonthChartProps {
    data: ChartsData[];
    productsSectionSubtitle: string;
    productsSectionLabel: string;
    isInvestment?: boolean;
}

export default function ProfitByMonthChart({
    data,
    productsSectionSubtitle,
    productsSectionLabel,
    isInvestment = false,
}: ProfitByMonthChartProps) {
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
                <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-1">Productos Destacados de {selectedMonth}</h3>
                    <p className="text-sm text-muted">{productsSectionSubtitle}</p>
                </div>

                <div className="space-y-3">
                    {topProducts.map((p, idx) => (
                        <div
                            key={p.productName}
                            className="flex items-center justify-between bg-border p-4 rounded-xl border border-border shadow-lg"
                        >
                            <div className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                                        idx === 0
                                            ? 'bg-yellow-500/20 text-yellow-300'
                                            : idx === 1
                                              ? 'bg-gray-400/20 text-gray-300'
                                              : 'bg-amber-700/20 text-amber-400'
                                    }`}
                                >
                                    <span className="font-bold text-sm">#{idx + 1}</span>
                                </div>
                                <span className="font-medium truncate max-w-[180px] md:max-w-full">
                                    {p.productName}
                                </span>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="font-bold text-lg">{p.quantity}</span>
                                <span className="text-xs text-muted mt-1 hidden md:block">{productsSectionLabel}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="w-full flex-1 p-4 flex flex-col">
            <div className="overflow-x-auto">
                <div style={{ minWidth: '700px' }}>
                    <ResponsiveContainer width="100%" height={300}>
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
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const total = payload.find((p) => p.dataKey === 'total')?.value ?? 0;
                                        const shippingTotal =
                                            payload.find((p) => p.dataKey === 'shippingTotal')?.value ?? 0;

                                        return (
                                            <div className="bg-border rounded-md p-3 shadow-lg shadow-main/50 text-sm">
                                                {isInvestment ? (
                                                    <>
                                                        <p className="font-medium capitalize mb-2">{label}</p>
                                                        <p className="text-muted">
                                                            Total de inversion:{' '}
                                                            <span className="text-secondary font-medium">
                                                                {formatPrice(Number(total))}
                                                            </span>
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="font-medium capitalize mb-2">{label}</p>
                                                        <p className="text-muted">
                                                            Total de ganancias:{' '}
                                                            <span className="text-secondary font-medium">
                                                                {formatPrice(Number(total))}
                                                            </span>
                                                        </p>
                                                        <p className="text-muted">
                                                            Total en envíos:{' '}
                                                            <span className="text-secondary font-medium">
                                                                {formatPrice(Number(shippingTotal))}
                                                            </span>
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="total"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                activeBar={<Rectangle fill="#16a34a" />}
                            />
                            {!isInvestment && (
                                <Bar
                                    dataKey="shippingTotal"
                                    fill="#dc2626"
                                    radius={[4, 4, 0, 0]}
                                    activeBar={<Rectangle fill="orange" />}
                                />
                            )}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-4 flex-1 overflow-auto">{renderTopProductsSection()}</div>
        </div>
    );
}
