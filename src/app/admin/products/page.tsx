import { getProductsByCategory } from '@/lib/services/product';
import Filters from '@/components/Filters';
import ProductsTable from '@/components/products/ProductsTable';

export default async function ProductsPage() {
    const products = await getProductsByCategory();
    return (
        <div>
            <div className="flex flex-col lg:flex-row justify-between gap-2 lg:gap-8">
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
            <div className="mt-8">
                <ProductsTable products={products} />
            </div>
        </div>
    );
}
