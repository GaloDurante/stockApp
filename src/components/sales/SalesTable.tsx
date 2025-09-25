'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format } from '@formkit/tempo';

import { SaleType } from '@/types/sale';
import { formatQuantity, formatPrice } from '@/lib/helpers/components/utils';
import { loadMoreSalesAction, deleteSaleByIdAction } from '@/lib/actions/sale';
import { showErrorToast, showSuccessToast } from '@/components/Toast';

import SaleCard from '@/components/sales/SaleCard';
import ActionsButtons from '@/components/ActionsButtons';
import ItemsMenu from '@/components/sales/ItemsMenu';
import SaleMoreDetails from '@/components/sales/SaleMoreDetails';
import Link from 'next/link';

interface SalesTableProps {
    initialSales: SaleType[];
    totalCount: number;
    sortOrder: 'id_asc' | 'id_desc' | 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc';
    perPage: number;
}

export default function SalesTable({ initialSales, totalCount, sortOrder, perPage }: SalesTableProps) {
    const [sales, setSales] = useState<SaleType[]>(initialSales);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialSales.length < totalCount);
    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const router = useRouter();

    const loader = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setSales(initialSales);
        setPage(1);
        setHasMore(initialSales.length < totalCount);
    }, [initialSales, totalCount, sortOrder]);

    const loadMoreSales = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const { sales: newSales } = await loadMoreSalesAction({
                sortOrder,
                page: nextPage,
                perPage,
            });
            setSales((prev) => [...prev, ...newSales]);
            setPage(nextPage);
            setHasMore(sales.length + newSales.length < totalCount);
        } catch {
            showErrorToast('Error cargando más ventas');
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, sortOrder, perPage, totalCount, sales.length]);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && !loading && hasMore) {
                loadMoreSales();
            }
        },
        [loading, hasMore, loadMoreSales]
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

    const handleDelete = async () => {
        if (!deleteModalId) return;
        setDeleteModalId(null);
        try {
            await deleteSaleByIdAction(deleteModalId);
            showSuccessToast('Venta eliminada con éxito');
            router.refresh();
        } catch {
            showErrorToast('No se pudo eliminar la venta');
        }
    };

    return (
        <div className="relative w-full overflow-auto rounded-lg max-h-[calc(100vh-22rem)] md:max-h-[calc(100vh-24rem)] lg:max-h-[calc(100vh-12rem)] custom-scrollbar">
            <table className="hidden md:table min-w-full border-t-2 border border-border bg-surface text-sm">
                <thead className="bg-border sticky -top-[1px]">
                    <tr className="text-left uppercase text-xs tracking-wider">
                        <th className="p-4">Acciones</th>
                        <th className="p-4">ID</th>
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Precio Total</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Método Pago</th>
                        <th className="p-4">Delivery</th>
                        <th className="p-4">Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="text-center py-6 text-muted">
                                No hay ventas para mostrar.
                            </td>
                        </tr>
                    ) : (
                        sales.map((sale) => (
                            <tr key={sale.id} className="border-t border-border hover:bg-border-dark transition-colors">
                                <td className="px-4 py-3 w-[1%]">
                                    <div className="flex gap-2">
                                        <ActionsButtons
                                            redirect={`/admin/sales/${sale.id}`}
                                            handleDelete={handleDelete}
                                            label={`la venta ID #${sale.id}`}
                                            isModalOpen={deleteModalId === sale.id}
                                            openModal={() => setDeleteModalId(sale.id)}
                                            closeModal={() => setDeleteModalId(null)}
                                            isTwoStep
                                            confirmationText={`Venta-ID-${sale.id}`}
                                            hideEditButton
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <Link className="hover:border-b transition-all" href={`/admin/sales/${sale.id}`}>
                                        #{sale.id}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {format({ date: sale.date, format: 'DD/MM/YYYY', tz: 'UTC' })}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">{formatPrice(sale.totalPrice)}</td>
                                {sale.items.length > 0 ? (
                                    <td className="px-2 py-1 whitespace-nowrap relative">
                                        <ItemsMenu items={sale.items} shippingPrice={sale.shippingPrice ?? 0} />
                                    </td>
                                ) : (
                                    <td className="px-4 py-3 whitespace-nowrap">{formatQuantity(sale.items.length)}</td>
                                )}
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex gap-1">
                                        {Array.from(new Set(sale.payments.map((p) => p.method))).map(
                                            (method, index) => (
                                                <span
                                                    key={index}
                                                    className={`${method === 'Efectivo' ? 'bg-green-600/30 text-green-600' : 'bg-accent/30 text-accent'} text-sm px-3 py-1.5 rounded-full font-medium`}
                                                >
                                                    {method}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {sale.shippingPrice ? (
                                        <span className="px-3 py-1.5 bg-terciary/30 text-terciary text-sm font-medium rounded-full">
                                            Envío incluido
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1.5 bg-muted/30 text-muted text-sm font-medium rounded-full">
                                            Sin envío
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <SaleMoreDetails sale={sale} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="md:hidden">
                {sales.length === 0 ? (
                    <div className="text-center py-6 text-muted">No hay ventas para mostrar.</div>
                ) : (
                    <div className="border border-border rounded-lg">
                        {sales.map((sale, index) => (
                            <SaleCard
                                deleteModalId={deleteModalId}
                                handleDelete={handleDelete}
                                setDeleteModalId={setDeleteModalId}
                                key={sale.id}
                                sale={sale}
                                className={`
                                    ${index === 0 ? 'rounded-t-lg' : ''}
                                    ${index === sales.length - 1 ? 'rounded-b-lg' : ''}
                                    ${index !== sales.length - 1 ? 'border-b border-border' : ''}
                                `}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div ref={loader} className="h-10 flex justify-center items-center">
                {loading && <span>Cargando más ventas...</span>}
                {!hasMore && sales.length > 0 && <span className="text-muted">Todas las ventas cargadas.</span>}
            </div>
        </div>
    );
}
