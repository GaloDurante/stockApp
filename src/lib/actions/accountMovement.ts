'use server';
import {
    getAccountMovements,
    deleteAccountMovementById,
    createAccountMovement,
    updateAccountMovement,
} from '@/lib/services/accountMovement';
import { AccountMovementFormType } from '@/types/form';

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

export async function createAccountMovementAction(data: AccountMovementFormType) {
    try {
        return await createAccountMovement(data);
    } catch {
        throw new Error('No se pudo crear el movimiento');
    }
}

export async function updateAccountMovementAction(data: AccountMovementFormType, id: number) {
    try {
        return await updateAccountMovement(data, id);
    } catch {
        throw new Error('No se pudo actualizar el movimiento');
    }
}
