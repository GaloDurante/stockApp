import ProductForm from '@/components/products/ProductForm';

export default function CreateProductPage() {
    return (
        <div className="px-4 py-8">
            <h1 className="text-4xl font-bold tracking-tight text-apur-green text-center">Crear Producto</h1>
            <p className="text-center text-neutral-500 text-sm mt-2">
                Completá el formulario para registrar un nuevo producto.
            </p>
            <div className="flex justify-center">
                <div className="mt-6 w-full sm:w-7/10 lg:w-5/10 2xl:w-4/10">
                    <ProductForm />
                </div>
            </div>
        </div>
    );
}
