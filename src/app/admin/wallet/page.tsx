import { getAccountBalances } from '@/lib/services/report';
import { getAccountMovements } from '@/lib/services/accountMovement';
import { format } from '@formkit/tempo';
import { formatPrice } from '@/lib/helpers/components/utils';
import ReceiverCard from '@/components/reports/ReceiverCard';
import { Wallet, Calendar, TrendingUp, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';

export default async function WalletPage() {
    const balances = await getAccountBalances();
    const movements = await getAccountMovements();

    const receiversMoney = Object.entries(balances).map(([receiver, total]) => ({
        receiver,
        total,
    }));

    const total = receiversMoney.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-semibold">Dashboard de Cuentas</h1>
                    <p className="text-muted mt-1 text-sm">Resumen completo de saldos y movimientos</p>
                </div>
            </div>

            <div className="bg-surface p-4 md:p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                    <div>
                        <Wallet size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-sm sm:text-base">Saldo total disponible</span>
                </div>
                <div className="text-2xl font-bold mb-2">{formatPrice(total)}</div>
                <div className="text-xs sm:text-sm text-muted">
                    Distribuido en {receiversMoney.length} cuenta{receiversMoney.length !== 1 ? 's' : ''}
                </div>
            </div>

            {receiversMoney.length > 0 && (
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold">Saldos por cuenta</h2>
                            <p className="text-muted mt-1 text-sm">Distribución porcentual de los fondos</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {receiversMoney.map((r, index) => {
                            const percentage = total > 0 ? ((r.total / total) * 100).toFixed(1) : 0;
                            return <ReceiverCard key={index} r={r} percentage={percentage} />;
                        })}
                    </div>
                </section>
            )}

            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold">Historial de movimientos</h2>
                        <p className="text-muted mt-1 text-sm">Registro completo de transacciones</p>
                    </div>
                </div>

                {movements.length === 0 ? (
                    <div className="text-center py-12  rounded-2xl border border-gray-200">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <TrendingUp size={32} className="text-muted" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No hay movimientos</h3>
                        <p className="text-muted">No se han registrado transacciones aún</p>
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
            </section>
        </div>
    );
}
