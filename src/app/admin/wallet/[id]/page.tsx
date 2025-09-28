import { getAccountMovementById } from '@/lib/services/accountMovement';

import ErrorMessage from '@/components/ErrorMessage';
import AccountMovementForm from '@/components/wallet/AccountMovementForm';

interface MovementPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MovementPage({ params }: MovementPageProps) {
    const { id } = await params;
    const movement = await getAccountMovementById(Number(id));

    if (!movement)
        return (
            <ErrorMessage
                title={'Movimiento no encontrado'}
                text={
                    'Lo sentimos, no pudimos encontrar el movimiento que buscás. Por favor, verifica el ID o intenta nuevamente más tarde.'
                }
            />
        );

    return (
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-center">Editar Movimiento</h1>
            <p className="text-center text-muted text-sm mt-2">
                Completá el formulario para actualizar un movimiento existente.
            </p>
            <div className="flex justify-center">
                <div className="mt-6 w-full lg:w-9/10 2xl:w-6/10">
                    <AccountMovementForm selectedMovement={movement} isEdit />
                </div>
            </div>
        </div>
    );
}
