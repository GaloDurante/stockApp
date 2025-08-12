import { ProductType } from '@/types/product';

import { formatPrice } from '@/lib/helpers/components/utils';

import { Search } from 'lucide-react';
import Filters from '@/components/Filters';

interface SelectProductsType {
    allProducts: ProductType[];
    search?: string;
    filterByCategory?: string;
}

export default function SelectProducts({ allProducts, search, filterByCategory }: SelectProductsType) {
    return (
        <div className="min-h-[60vh]">
            <div className="flex gap-4 p-4 border-b border-border">
                <Filters
                    withSearch
                    withCategories
                    searchPlaceholder="Buscar producto por nombre"
                    search={search}
                    selectedCategory={filterByCategory}
                    showAllCategory
                />
            </div>
            {allProducts.length === 0 ? (
                <div className="py-6 px-4 min-h-[calc(60vh-5.5rem)] flex flex-col justify-center items-center">
                    <Search />
                    <div className="text-center font-semibold mt-2">No se encontró ningun producto.</div>
                    <div className="text-center text-muted text-sm mt-2">
                        Prueba a cambiar los filtros o el término de búsqueda.
                    </div>
                </div>
            ) : (
                <div className="max-h-[calc(60vh-5.5rem)] overflow-y-auto custom-scrollbar relative">
                    <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 px-4 py-2 bg-border sticky top-0 text-xs font-semibold">
                        <span>Producto</span>
                        <span>Inventario</span>
                        <span>Precio</span>
                    </div>

                    {allProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className={`grid grid-cols-[2fr_1fr_1fr] gap-4 p-4 ${index !== allProducts.length - 1 ? 'border-b border-border' : ''}`}
                        >
                            <div>{product.name}</div>
                            <div
                                className={`${product.stock == 0 ? 'text-red-700' : product.stock > 0 && product.stock < 8 ? 'text-yellow-600' : ''}`}
                            >
                                {product.stock}
                            </div>
                            <div>{formatPrice(product.price)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
