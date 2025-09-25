interface MovementPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function MovementPage({ params }: MovementPageProps) {
    const { id } = await params;

    return (
        <div>
            <span>Movimiento {id}</span>
        </div>
    );
}
