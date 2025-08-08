import ProductForm from '@/components/products/ProductForm';

export default function CreateProductPage() {
    return (
        <div>
            <h1 className="text-4xl font-bold tracking-tight text-center">Crear Producto</h1>
            <p className="text-center text-muted text-sm mt-2">
                Completá el formulario para registrar un nuevo producto.
            </p>
            <div className="flex justify-center">
                <div className="mt-6 w-full md:w-7/10 2xl:w-5/10">
                    <ProductForm />
                </div>
            </div>
        </div>
    );
}
