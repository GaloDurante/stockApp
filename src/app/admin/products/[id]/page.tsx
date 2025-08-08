import { getProductById } from '@/lib/services/product';

import ProductForm from '@/components/products/ProductForm';
import ErrorMessage from '@/components/ErrorMessage';

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
            <h1 className="text-4xl font-bold tracking-tight text-center">Editar Producto</h1>
            <div className="flex justify-center">
                <div className="mt-6 w-full md:w-7/10 2xl:w-5/10">
                    <ProductForm selectedProduct={product} isEdit />
                </div>
            </div>
        </div>
    );
}
