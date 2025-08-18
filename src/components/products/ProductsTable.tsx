'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { ProductType } from '@/types/product';
import { loadMoreProductsAction, deleteProductByIdAction } from '@/lib/actions/product';

import { formatCategory, formatPrice, renderStock } from '@/lib/helpers/components/utils';

import { showErrorToast, showSuccessToast } from '@/components/Toast';
import TableActionsButtons from '@/components/products/TableActionsButtons';
import ProductCard from '@/components/products/ProductCard';

interface ProductsTableProps {
    initialProducts: ProductType[];
    totalCount: number;
    search: string;
    filterByCategory: string;
    sortOrder: 'asc' | 'desc' | 'price_asc' | 'price_desc';
    perPage: number;
}

export default function ProductsTable({
    initialProducts,
    totalCount,
    search,
    filterByCategory,
    sortOrder,
    perPage,
}: ProductsTableProps) {
    const [products, setProducts] = useState<ProductType[]>(initialProducts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialProducts.length < totalCount);
    const [deleteModalId, setDeleteModalId] = useState<number | null>(null);
    const router = useRouter();

    const loader = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setProducts(initialProducts);
        setPage(1);
        setHasMore(initialProducts.length < totalCount);
    }, [initialProducts, totalCount, search, filterByCategory, sortOrder]);

    const loadMoreProducts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const { products: newProducts } = await loadMoreProductsAction({
                search,
                filterByCategory,
                sortOrder,
                page: nextPage,
                perPage,
            });
            setProducts((prev) => [...prev, ...newProducts]);
            setPage(nextPage);
            setHasMore(products.length + newProducts.length < totalCount);
        } catch {
            showErrorToast('Error cargando más productos');
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, search, filterByCategory, sortOrder, perPage, totalCount, products.length]);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && !loading && hasMore) {
                loadMoreProducts();
            }
        },
        [loading, hasMore, loadMoreProducts]
    );

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };
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
            await deleteProductByIdAction(deleteModalId);
            showSuccessToast('Producto eliminado con éxito');
            router.refresh();
        } catch {
            showErrorToast('No se pudo eliminar el producto');
        }
    };

    return (
        <div className="relative w-full overflow-auto rounded-lg max-h-[calc(100vh-22rem)] md:max-h-[calc(100vh-24rem)] lg:max-h-[calc(100vh-12rem)] custom-scrollbar">
            <table className="hidden md:table min-w-full border-t-2 border border-border bg-surface text-sm">
                <thead className="bg-border sticky -top-[1px]">
                    <tr className="text-left uppercase text-xs tracking-wider">
                        <th className="p-4 w-[1%]">Acciones</th>
                        <th className="p-4">Producto</th>
                        <th className="p-4">Categoría</th>
                        <th className="p-4">Inventario</th>
                        <th className="p-4">Precio unitario</th>
                        <th className="p-4">Monto total</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-muted">
                                No hay productos para mostrar.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-t border-border hover:bg-border-dark transition-colors"
                            >
                                <td className="px-4 py-3 w-[1%]">
                                    <div className="flex gap-2">
                                        <TableActionsButtons
                                            redirect={`/admin/products/${product.id}`}
                                            handleDelete={handleDelete}
                                            label={`${product.name}`}
                                            isModalOpen={deleteModalId === product.id}
                                            openModal={() => setDeleteModalId(product.id)}
                                            closeModal={() => setDeleteModalId(null)}
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-3 w-[30%]">
                                    <span className="block w-[230px] xl:w-[450px] truncate">{product.name}</span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">{formatCategory(product.category)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{renderStock(product.stock)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{formatPrice(product.purchasePrice)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {formatPrice(product.purchasePrice * product.stock)}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="md:hidden">
                {products.length === 0 ? (
                    <div>
                        <div className="text-center py-6 text-muted">No hay productos para mostrar.</div>
                    </div>
                ) : (
                    <div className="border border-border rounded-lg">
                        {products.map((product, index) => (
                            <ProductCard
                                deleteModalId={deleteModalId}
                                handleDelete={handleDelete}
                                setDeleteModalId={setDeleteModalId}
                                key={product.id}
                                product={product}
                                className={`
                        ${index === 0 ? 'rounded-t-lg' : ''}
                        ${index === products.length - 1 ? 'rounded-b-lg' : ''}
                        ${index !== products.length - 1 ? 'border-b border-border' : ''}
                    `}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div ref={loader} className="h-10 flex justify-center items-center">
                {loading && <span>Cargando más productos...</span>}
                {!hasMore && products.length > 0 && <span className="text-muted">Todos los productos cargados.</span>}
            </div>
        </div>
    );
}
