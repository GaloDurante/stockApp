import { ProductType } from '@/types/product';
import { formatCategory, formatPrice, renderStock } from '@/lib/helpers/components/utils';

import ActionsButtons from '@/components/ActionsButtons';

interface ProductCardType {
    product: ProductType;
    className?: string;
    handleDelete: () => void;
    deleteModalId: number | null;
    setDeleteModalId: (id: number | null) => void;
}

export default function ProductCard({
    product,
    className,
    handleDelete,
    deleteModalId,
    setDeleteModalId,
}: ProductCardType) {
    return (
        <div className={`bg-surface p-4 flex items-start justify-between ${className || ''}`}>
            <div className="flex flex-col gap-1">
                <span className="text-base font-medium">{product.name}</span>

                <div className="flex gap-3 text-sm text-muted">
                    <span>{renderStock(product.stock)}</span>
                    <span>•</span>
                    <span>{formatCategory(product.category)}</span>
                </div>

                <div>
                    <span className="text-sm font-semibold">{formatPrice(product.purchasePrice)}</span>
                    <span> | </span>
                    <span className="text-sm font-semibold">{formatPrice(product.purchasePrice * product.stock)}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <ActionsButtons
                    redirect={`/admin/products/${product.id}`}
                    handleDelete={handleDelete}
                    label={`${product.name}`}
                    isModalOpen={deleteModalId === product.id}
                    openModal={() => setDeleteModalId(product.id)}
                    closeModal={() => setDeleteModalId(null)}
                />
            </div>
        </div>
    );
}
