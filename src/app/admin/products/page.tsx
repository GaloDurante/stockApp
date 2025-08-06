import { getProductsByCategory } from '@/lib/services/product';
import Filters from '@/components/Filters';

export default async function ProductsPage() {
    const products = await getProductsByCategory();
    return (
        <div>
            <div className="flex justify-between gap-20">
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
        </div>
    );
}
