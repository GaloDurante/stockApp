'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { loadMoreMovementsAction } from '@/lib/actions/accountMovement';

import { AccountMovementType } from '@/types/accountMovement';

import { TrendingUp } from 'lucide-react';
import { showErrorToast } from '@/components/Toast';
import MovementCard from '@/components/wallet/MovementCard';

interface MovementsListProps {
    initialMovements: AccountMovementType[];
    totalCount: number;
    sortOrder: 'date_asc' | 'date_desc';
    perPage: number;
}

export default function MovementsList({ initialMovements, totalCount, sortOrder, perPage }: MovementsListProps) {
    const [movements, setMovements] = useState<AccountMovementType[]>(initialMovements);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialMovements.length < totalCount);

    const loader = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setMovements(initialMovements);
        setPage(1);
        setHasMore(initialMovements.length < totalCount);
    }, [initialMovements, totalCount, sortOrder]);

    const loadMoreMovements = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const { movements: newMovements } = await loadMoreMovementsAction({
                sortOrder,
                page: nextPage,
                perPage,
            });
            setMovements((prev) => [...prev, ...newMovements]);
            setPage(nextPage);
            setHasMore(movements.length + newMovements.length < totalCount);
        } catch {
            showErrorToast('Error cargando más movimientos');
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, sortOrder, perPage, totalCount, movements.length]);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && !loading && hasMore) {
                loadMoreMovements();
            }
        },
        [loading, hasMore, loadMoreMovements]
    );

    useEffect(() => {
        const options = { root: null, rootMargin: '0px', threshold: 0.1 };
        const currentLoader = loader.current;
        const observer = new IntersectionObserver(handleObserver, options);
        if (currentLoader && hasMore) observer.observe(currentLoader);
        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
            observer.disconnect();
        };
    }, [handleObserver, hasMore]);

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
                        <MovementCard key={m.id} movement={m} />
                    ))}
                </div>
            )}
            <div ref={loader} className="h-10 flex justify-center items-center">
                {loading && <span>Cargando más movimientos...</span>}
                {!hasMore && movements.length > 0 && (
                    <span className="text-muted">Todos los movimientos cargados.</span>
                )}
            </div>
        </>
    );
}
