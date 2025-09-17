export const formatCategory = (category: string | null) => {
    if (!category) return '';
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase().replace('_', ' ');
};
export const formatPrice = (price: number) => price.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
export const renderStock = (stock: number) =>
    stock < 1 ? (
        <span className="text-red-700">Sin stock</span>
    ) : (
        <span className={`${stock < 16 && 'text-terciary'}`}>{stock} en stock</span>
    );

export const formatQuantity = (quantity: number) =>
    quantity > 1 ? <span>{quantity} items</span> : <span>{quantity} item</span>;
