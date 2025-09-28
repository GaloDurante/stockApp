import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { format } from '@formkit/tempo';
import { formatPrice } from '@/lib/helpers/components/utils';
import { AccountMovementType } from '@/types/accountMovement';
import { deleteAccountMovementByIdAction } from '@/lib/actions/accountMovement';

import { Calendar, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react';
import { showErrorToast, showSuccessToast } from '@/components/Toast';
import ActionsButtons from '@/components/ActionsButtons';

interface MovementCardProps {
    movement: AccountMovementType;
}

export default function MovementCard({ movement }: MovementCardProps) {
    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const router = useRouter();

    const handleDelete = async () => {
        if (!deleteModalId) return;
        setDeleteModalId(null);
        try {
            await deleteAccountMovementByIdAction(deleteModalId);
            showSuccessToast('Movimiento eliminado con éxito');
            router.refresh();
        } catch {
            showErrorToast('No se pudo eliminar el movimiento');
        }
    };

    return (
        <div key={movement.id} className="bg-surface rounded-xl border border-border p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div
                        className={`p-2 rounded-lg ${
                            movement.type.toLowerCase() === 'ingreso'
                                ? 'bg-green-600/30 text-green-600'
                                : 'bg-red-700/30 text-red-700'
                        }`}
                    >
                        {movement.type.toLowerCase() === 'ingreso' ? (
                            <ArrowUpRight size={16} />
                        ) : (
                            <ArrowDownLeft size={16} />
                        )}
                    </div>
                    <span className={`text-sm font-medium`}>{movement.type}</span>
                    <div className="flex items-center gap-1 text-sm text-muted ml-2">
                        <Calendar size={12} />
                        {format({ date: movement.date, format: 'DD/MM/YY' })}
                    </div>
                </div>
                <div className="flex gap-1">
                    <ActionsButtons
                        redirect={movement.saleId ? `/admin/sales/${movement.saleId}` : `/admin/wallet/${movement.id}`}
                        handleDelete={handleDelete}
                        label={`${movement.type} de ${formatPrice(movement.amount)}`}
                        isModalOpen={deleteModalId === movement.id}
                        openModal={() => setDeleteModalId(movement.id)}
                        closeModal={() => setDeleteModalId(null)}
                        hideDeleteButton={!!movement.saleId}
                    />
                </div>
            </div>

            {movement.description && (
                <div className="flex items-center gap-2 mb-3">
                    <FileText size={14} className="text-muted" />
                    <h3 className="line-clamp-2">{movement.description}</h3>
                </div>
            )}

            <div className="flex items-center justify-between">
                <span
                    className={`px-3 py-1.5 text-xs font-medium rounded-full ${movement.receiver == 'Walter' ? 'bg-accent/30 text-accent' : 'bg-terciary/30 text-terciary'}`}
                >
                    {movement.receiver}
                </span>
                <span
                    className={`text-lg font-semibold ${
                        movement.type.toLowerCase() === 'ingreso' ? 'text-green-600' : 'text-red-700'
                    }`}
                >
                    {movement.type.toLowerCase() === 'ingreso' ? '+' : '-'}
                    {formatPrice(movement.amount)}
                </span>
            </div>
        </div>
    );
}
