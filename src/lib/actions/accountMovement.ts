'use server';
import { getAccountMovements, deleteAccountMovementById } from '@/lib/services/accountMovement';

export async function loadMoreMovementsAction({
    sortOrder,
    page,
    perPage,
}: {
    sortOrder?: 'date_asc' | 'date_desc';
    page: number;
    perPage: number;
}) {
    try {
        const { movements, total } = await getAccountMovements({
            sortOrder,
            page,
            perPage,
        });

        return { movements, total };
    } catch {
        throw new Error('No se pudieron cargar más movimientos');
    }
}

export async function deleteAccountMovementByIdAction(id: number) {
    try {
        return await deleteAccountMovementById(id);
    } catch {
        throw new Error('No se pudo eliminar el movimiento');
    }
}
