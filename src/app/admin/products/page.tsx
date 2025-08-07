import { getProductsByCategory } from '@/lib/services/product';
import Filters from '@/components/Filters';
import ProductsTable from '@/components/products/ProductsTable';
import Link from 'next/link';

export default async function ProductsPage() {
    const products = await getProductsByCategory();
    return (
        <div>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-2">
                <div className="flex flex-col lg:flex-row justify-between gap-2 xl:gap-8 w-full lg:w-3/4">
                    <Filters
                        withSort
                        withSearch
                        withCategories
                        sortOrder="asc"
                        searchPlaceholder={'Buscar por nombre del producto'}
                        search={undefined}
                        selectedCategory={undefined}
                        showAllCategory
                    />
                </div>
                <Link
                    href="/admin/products/new"
                    className="self-end border border-border font-semibold bg-surface hover:bg-border-dark rounded-md px-4 py-2 transition-all"
                >
                    Crear producto
                </Link>
            </div>
            <div className="mt-4 lg:mt-8">
                <ProductsTable products={products} />
            </div>
        </div>
    );
}
