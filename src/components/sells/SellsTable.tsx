'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from '@formkit/tempo';

import { SellType } from '@/types/sell';
import { formatQuantity, formatPrice } from '@/lib/helpers/components/utils';
import { loadMoreSellsAction } from '@/lib/actions/sell';
import { showErrorToast } from '@/components/Toast';

import SellCard from '@/components/sells/SellCard';

interface SellsTableProps {
    initialSells: SellType[];
    totalCount: number;
    sortOrder: 'id_asc' | 'id_desc' | 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc';
    perPage: number;
}

export default function SellsTable({ initialSells, totalCount, sortOrder, perPage }: SellsTableProps) {
    const [sells, setSells] = useState<SellType[]>(initialSells);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialSells.length < totalCount);

    const loader = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setSells(initialSells);
        setPage(1);
        setHasMore(initialSells.length < totalCount);
    }, [initialSells, totalCount, sortOrder]);

    const loadMoreSells = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const { sells: newSells } = await loadMoreSellsAction({
                sortOrder,
                page: nextPage,
                perPage,
            });
            setSells((prev) => [...prev, ...newSells]);
            setPage(nextPage);
            setHasMore(sells.length + newSells.length < totalCount);
        } catch {
            showErrorToast('Error cargando más ventas');
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, sortOrder, perPage, totalCount, sells.length]);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && !loading && hasMore) {
                loadMoreSells();
            }
        },
        [loading, hasMore, loadMoreSells]
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
        <div className="relative w-full overflow-auto rounded-lg max-h-[calc(100vh-22rem)] md:max-h-[calc(100vh-24rem)] lg:max-h-[calc(100vh-12rem)] custom-scrollbar">
            <table className="hidden md:table min-w-full border-t-2 border border-border bg-surface text-sm">
                <thead className="bg-border sticky -top-[1px]">
                    <tr className="text-left uppercase text-xs tracking-wider">
                        <th className="p-4 w-[5%]">ID</th>
                        <th className="p-4 w-[20%]">Fecha</th>
                        <th className="p-4 w-[15%]">Precio Total</th>
                        <th className="p-4 w-[10%]">Items</th>
                        <th className="p-4 w-[15%]">Método Pago</th>
                        <th className="p-4 w-[15%]">Receptor</th>
                    </tr>
                </thead>
                <tbody>
                    {sells.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-6 text-muted">
                                No hay ventas para mostrar.
                            </td>
                        </tr>
                    ) : (
                        sells.map((sell) => (
                            <tr key={sell.id} className="border-t border-border hover:bg-border-dark transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap">#{sell.id}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {format({ date: sell.date, format: 'DD/MM/YYYY', tz: 'UTC' })}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">{formatPrice(sell.totalPrice)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{formatQuantity(sell.items.length)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{sell.paymentMethod}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{sell.receiver}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="md:hidden">
                {sells.length === 0 ? (
                    <div className="text-center py-6 text-muted">No hay ventas para mostrar.</div>
                ) : (
                    <div className="border border-border rounded-lg">
                        {sells.map((sell, index) => (
                            <SellCard
                                key={sell.id}
                                sell={sell}
                                className={`
                                    ${index === 0 ? 'rounded-t-lg' : ''}
                                    ${index === sells.length - 1 ? 'rounded-b-lg' : ''}
                                    ${index !== sells.length - 1 ? 'border-b border-border' : ''}
                                `}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div ref={loader} className="h-10 flex justify-center items-center">
                {loading && <span>Cargando más ventas...</span>}
                {!hasMore && sells.length > 0 && <span className="text-muted">Todas las ventas cargadas.</span>}
            </div>
        </div>
    );
}
