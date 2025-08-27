'use client';
import { formatPrice } from '@/lib/helpers/components/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Rectangle, CartesianGrid } from 'recharts';

interface ProfitByMonthChartProps {
    data: { month: string; total: number }[];
}

export default function ProfitByMonthChart({ data }: ProfitByMonthChartProps) {
    return (
        <div className="w-full flex-1 p-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#444" />
                    <XAxis dataKey="month" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-border p-2 rounded shadow-md">
                                        <p className="font-semibold">{label}</p>
                                        <p>{formatPrice(Number(payload[0].value))}</p>
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
                        activeBar={<Rectangle fill="#FFEDD5" stroke="#3b82f6" />}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
