import { getProductById } from '@/lib/services/product';

import ProductForm from '@/components/products/ProductForm';
import ErrorMessage from '@/components/ErrorMessage';
import ProductActionButtons from '@/components/ProductActionButtons';

interface ProductPageType {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageType) {
    const { id } = await params;
    const product = await getProductById(Number(id));

    if (!product)
        return (
            <ErrorMessage
                title={'Producto no encontrado'}
                text={
                    'Lo sentimos, no pudimos encontrar el producto que buscás. Por favor, verifica el ID o intenta nuevamente más tarde.'
                }
            />
        );

    return (
        <div>
            <div className="flex justify-center">
                <div className="w-full lg:w-9/10 2xl:w-6/10">
                    <ProductActionButtons baseProduct={product} />
                    <ProductForm selectedProduct={product} isEdit />
                </div>
            </div>
        </div>
    );
}
