import { ProductType } from '@/types/product';

import TableActionsButtons from '@/components/products/TableActionsButtons';

interface TableProps {
    products: ProductType[];
}

export default function ProductsTable({ products }: TableProps) {
    const formatCategory = (category: string | null) => {
        if (!category) return '';
        return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase().replace('_', ' ');
    };
    const formatPrice = (price: number) => price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    const renderStock = (stock: number) => {
        if (stock < 1) {
            return <span>Sin stock</span>;
        } else {
            return <span>{stock} en stock</span>;
        }
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-full border border-border rounded-lg overflow-hidden bg-surface text-sm">
                <thead>
                    <tr className="bg-border text-left uppercase text-xs tracking-wider">
                        <th className="px-4 py-3 w-[1%]">Acciones</th>
                        <th className="px-4 py-3">Producto</th>
                        <th className="px-4 py-3">Categoría</th>
                        <th className="px-4 py-3">Inventario</th>
                        <th className="px-4 py-3">Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center py-6 text-muted">
                                No hay productos para mostrar.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-t border-border hover:bg-border-dark transition-colors"
                            >
                                <td className="px-4 py-3 w-[1%]">
                                    <div className="flex gap-2">
                                        <TableActionsButtons row={product} />
                                    </div>
                                </td>
                                <td className="px-4 py-3 w-[30%]">
                                    <span className="block w-[230px] md:w-[350px] xl:w-[450px] truncate">
                                        {product.name}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">{formatCategory(product.category)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{renderStock(product.stock)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{formatPrice(product.price)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
