import { getAccountBalances } from '@/lib/services/report';
import { getAccountMovements } from '@/lib/services/accountMovement';
import { formatPrice } from '@/lib/helpers/components/utils';
import { dayStart, dayEnd } from '@formkit/tempo';
import { Wallet, ChevronsUp } from 'lucide-react';

import Link from 'next/link';
import ReceiverCard from '@/components/reports/ReceiverCard';
import MovementsList from '@/components/wallet/MovementsList';
import Filters from '@/components/Filters';

interface WalletPageProps {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
        sortOrder?: 'date_asc' | 'date_desc';
    }>;
}

export default async function WalletPage({ searchParams }: WalletPageProps) {
    const { startDate, endDate, sortOrder = 'date_desc' } = await searchParams;
    const pageNumber = 1;
    const perPage = 20;

    const { movements, total } = await getAccountMovements({
        startDate: startDate ? dayStart(startDate).toISOString() : undefined,
        endDate: endDate ? dayEnd(endDate).toISOString() : undefined,
        sortOrder,
        page: pageNumber,
        perPage: perPage,
    });
    const sortOptions = [
        { value: 'date_desc', label: 'Fecha: más reciente' },
        { value: 'date_asc', label: 'Fecha: más antigua' },
    ];

    const balances = await getAccountBalances();
    const receiversMoney = Object.entries(balances).map(([receiver, total]) => ({
        receiver,
        total,
    }));
    const totalMoney = receiversMoney.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="space-y-8">
            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-semibold">Dashboard de Cuentas</h1>
                        <p className="text-muted mt-1 text-sm">Resumen completo de saldos y movimientos</p>
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
                <section className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold">Saldos por cuenta</h2>
                            <p className="text-muted mt-1 text-sm">Distribución de los fondos en cada cuenta</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {receiversMoney.map((r, index) => {
                            return <ReceiverCard key={index} r={r} />;
                        })}
                    </div>
                </section>
            )}

            <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold">Historial de movimientos</h2>
                        <p className="text-muted mt-1 text-sm">Registro completo de transacciones</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-2">
                    <div className="flex flex-col lg:flex-row justify-between gap-2 lg:gap-4 w-full lg:w-3/4">
                        <Filters
                            withSort
                            sortOrder={sortOrder}
                            baseSortOptions={sortOptions}
                            withDateRange
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </div>
                    <Link
                        href="/admin/wallet/new"
                        className="self-end border border-border font-semibold bg-surface hover:bg-border-dark rounded-md px-4 py-2 transition-all"
                    >
                        Nuevo movimiento
                    </Link>
                </div>
                <MovementsList
                    initialMovements={movements}
                    totalCount={total}
                    sortOrder={sortOrder}
                    perPage={perPage}
                />
            </section>

            <Link
                href="#main-top"
                className="fixed bottom-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-accent/30 text-accent hover:bg-accent/50 transition"
            >
                <ChevronsUp height={18} />
            </Link>
        </div>
    );
}
