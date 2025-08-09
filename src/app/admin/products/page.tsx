import { getProductsByCategory } from '@/lib/services/product';
import Filters from '@/components/Filters';
import ProductsTable from '@/components/products/ProductsTable';
import Link from 'next/link';

interface ProductsPageType {
    searchParams: Promise<{
        search?: string;
        filterByCategory?: string;
        sortOrder?: 'asc' | 'desc' | 'price_asc' | 'price_desc';
        page?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageType) {
    const { search, filterByCategory, sortOrder = 'asc', page = '1' } = await searchParams;
    const pageNumber = Number(page) || 1;
    const perPage = 25;
    const { products, total } = await getProductsByCategory({
        search,
        filterByCategory,
        sortOrder,
        page: pageNumber,
        perPage,
    });

    const totalPages = perPage > 0 ? Math.ceil(total / perPage) : 1;

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
                        search={search}
                        selectedCategory={filterByCategory}
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
                <ProductsTable products={products} page={pageNumber} totalPages={totalPages} />
            </div>
        </div>
    );
}
