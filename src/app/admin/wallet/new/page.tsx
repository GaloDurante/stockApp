import AccountMovementForm from '@/components/wallet/AccountMovementForm';

export default function NewMovementPage() {
    return (
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-center">Crear Movimiento</h1>
            <p className="text-center text-muted text-sm mt-2">
                Completá el formulario para registrar un nuevo movimiento.
            </p>
            <div className="flex justify-center">
                <div className="mt-6 w-full lg:w-9/10 2xl:w-6/10">
                    <AccountMovementForm />
                </div>
            </div>
        </div>
    );
}
