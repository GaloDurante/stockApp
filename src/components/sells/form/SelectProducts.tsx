'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

import { ProductType } from '@/types/product';
import { ProductSellFormType } from '@/types/form';

import { loadMoreProductsAction } from '@/lib/actions/product';
import { formatPrice } from '@/lib/helpers/components/utils';

import { Search } from 'lucide-react';
import { showErrorToast } from '@/components/Toast';
import Filters from '@/components/Filters';

interface SelectProductsType {
    initialProducts: ProductType[];
    totalCount: number;
    search?: string;
    filterByCategory?: string;
    perPage: number;
    selectedItems: ProductSellFormType[];
    onChange: (items: ProductSellFormType[]) => void;
}

export default function SelectProducts({
    initialProducts,
    totalCount,
    search,
    filterByCategory,
    perPage,
    selectedItems,
    onChange,
}: SelectProductsType) {
    const [products, setProducts] = useState<ProductType[]>(initialProducts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialProducts.length < totalCount);

    const loader = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setProducts(initialProducts);
        setPage(1);
        setHasMore(initialProducts.length < totalCount);
    }, [initialProducts, totalCount, search, filterByCategory]);

    const loadMoreProducts = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const nextPage = page + 1;
            const { products: newProducts } = await loadMoreProductsAction({
                search,
                filterByCategory,
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
    }, [loading, hasMore, page, search, filterByCategory, perPage, totalCount, products.length]);

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
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        });
        const currentLoader = loader.current;
        if (currentLoader && hasMore) observer.observe(currentLoader);
        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
            observer.disconnect();
        };
    }, [handleObserver, hasMore]);

    const toggleSelect = (product: ProductType) => {
        const isSelected = selectedItems.some((item) => item.id === product.id);

        if (isSelected) {
            onChange(selectedItems.filter((item) => item.id !== product.id));
        } else {
            onChange([...selectedItems, { ...product, quantity: 1 }]);
        }
    };

    return (
        <div className="min-h-[60vh]">
            <div className="flex flex-col md:flex-row gap-4 p-4 border-b border-border">
                <Filters
                    withSearch
                    withCategories
                    searchPlaceholder="Buscar producto por nombre"
                    search={search}
                    selectedCategory={filterByCategory}
                    showAllCategory
                />
            </div>

            {products.length === 0 ? (
                <div className="py-6 px-4 min-h-[calc(60vh-5.5rem)] flex flex-col justify-center items-center">
                    <Search />
                    <div className="text-center font-semibold mt-2">No se encontró ningun producto.</div>
                    <div className="text-center text-muted text-sm mt-2">
                        Prueba a cambiar los filtros o el término de búsqueda.
                    </div>
                </div>
            ) : (
                <div className="max-h-[calc(60vh-5.5rem)] overflow-y-auto custom-scrollbar relative">
                    <div className="grid grid-cols-[auto_2fr_1fr_1fr] gap-4 px-4 py-2 bg-border sticky top-0 text-xs font-semibold">
                        <span></span>
                        <span>Producto</span>
                        <span>Inventario</span>
                        <span>Precio</span>
                    </div>

                    {products.map((product, index) => {
                        const isChecked = selectedItems.some((item) => item.id === product.id);
                        return (
                            <label
                                key={product.id}
                                className={`grid grid-cols-[auto_2fr_1fr_1fr] gap-4 p-4 items-center ${
                                    index !== products.length - 1 ? 'border-b border-border' : ''
                                } ${product.stock == 0 ? 'text-muted/30' : 'hover:bg-border-dark cursor-pointer'}`}
                            >
                                <input
                                    type="checkbox"
                                    disabled={product.stock === 0}
                                    checked={isChecked}
                                    onChange={() => toggleSelect(product)}
                                    className="w-4 h-4 accent-accent cursor-pointer disabled:cursor-default "
                                />
                                <div className="truncate">{product.name}</div>
                                <div
                                    className={`${
                                        product.stock === 0
                                            ? 'text-red-700'
                                            : product.stock > 0 && product.stock < 8
                                              ? 'text-yellow-600'
                                              : ''
                                    }`}
                                >
                                    {product.stock}
                                </div>
                                <div>{formatPrice(product.purchasePrice)}</div>
                            </label>
                        );
                    })}

                    <div ref={loader} className="h-10 flex justify-center items-center">
                        {loading && <span>Cargando más productos...</span>}
                        {!hasMore && products.length > 0 && (
                            <span className="text-muted">Todos los productos cargados.</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
