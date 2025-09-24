'use client';

import { format } from '@formkit/tempo';
import { formatPrice } from '@/lib/helpers/components/utils';
import { AccountMovementType } from '@/types/accountMovement';

import { Calendar, TrendingUp, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';

interface MovementsListProps {
    movements: AccountMovementType[];
    totalCount: number;
    sortOrder: 'date_asc' | 'date_desc';
    perPage: number;
}

export default function MovementsList({ movements, totalCount, sortOrder, perPage }: MovementsListProps) {
    return (
        <>
            {movements.length === 0 ? (
                <div className="text-center py-12 rounded-lg border border-border">
                    <div className="w-14 h-14 mx-auto mb-4 bg-muted/30 rounded-full flex items-center justify-center">
                        <TrendingUp size={32} className="text-muted" />
                    </div>
                    <h3 className="font-medium mb-1">No hay movimientos</h3>
                    <p className="text-muted text-sm">No se han registrado transacciones aún</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {movements.map((m) => (
                        <div key={m.id} className="bg-surface rounded-xl border border-border p-4 md:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`p-2 rounded-lg ${
                                            m.type.toLowerCase() === 'ingreso'
                                                ? 'bg-green-600/30 text-green-600'
                                                : 'bg-red-600/30 text-red-600'
                                        }`}
                                    >
                                        {m.type.toLowerCase() === 'ingreso' ? (
                                            <ArrowUpRight size={16} />
                                        ) : (
                                            <ArrowDownLeft size={16} />
                                        )}
                                    </div>
                                    <span className={`text-sm font-medium`}>{m.type}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted">
                                    <Calendar size={12} />
                                    {format({ date: m.date, format: 'DD/MM/YY', tz: 'UTC' })}
                                </div>
                            </div>

                            {m.description && (
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText size={14} className="text-muted" />
                                    <h3 className="line-clamp-2">{m.description}</h3>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span
                                    className={`px-3 py-1.5 text-xs font-medium rounded-full ${m.receiver == 'Walter' ? 'bg-accent/30 text-accent' : 'bg-terciary/30 text-terciary'}`}
                                >
                                    {m.receiver}
                                </span>
                                <span
                                    className={`text-lg font-semibold ${
                                        m.type.toLowerCase() === 'ingreso' ? 'text-green-600' : 'text-red-600'
                                    }`}
                                >
                                    {m.type.toLowerCase() === 'ingreso' ? '+' : '-'}
                                    {formatPrice(m.amount)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
