import SellForm from '@/components/sells/SellForm';
import { getProductsByCategory } from '@/lib/services/product';

interface CreateSellPageType {
    searchParams: Promise<{
        filterByCategory?: string;
        search?: string;
    }>;
}

export default async function CreateSellPage({ searchParams }: CreateSellPageType) {
    const { filterByCategory, search } = await searchParams;
    const pageNumber = 1;
    const perPage = 20;

    const { products: initialProducts, total } = await getProductsByCategory({
        filterByCategory,
        search,
        page: pageNumber,
        perPage,
    });

    return (
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-center">Crear Venta</h1>
            <p className="text-center text-muted text-sm mt-2">
                Completá el formulario para registrar una nueva venta.
            </p>
            <div className="flex justify-center">
                <div className="mt-6 w-full md:w-7/10 2xl:w-5/10">
                    <SellForm
                        perPage={perPage}
                        totalCount={total}
                        initialProducts={initialProducts}
                        search={search}
                        filterByCategory={filterByCategory}
                    />
                </div>
            </div>
        </div>
    );
}
