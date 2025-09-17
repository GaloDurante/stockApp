import { dayStart, dayEnd } from '@formkit/tempo';
import { getAllSells } from '@/lib/services/sell';
import Filters from '@/components/Filters';
import Link from 'next/link';
import SellsTable from '@/components/sells/SellsTable';

interface SellsPageType {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
        paymentMethod?: string;
        sortOrder?: 'id_asc' | 'id_desc' | 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc';
        status?: 'Pendiente' | 'Completada';
    }>;
}

export default async function SellsPage({ searchParams }: SellsPageType) {
    const { startDate, endDate, paymentMethod, sortOrder = 'date_desc', status = 'Completada' } = await searchParams;

    const pageNumber = 1;
    const perPage = 20;

    const { sells: initialSells, total } = await getAllSells({
        startDate: startDate ? dayStart(startDate).toISOString() : undefined,
        endDate: endDate ? dayEnd(endDate).toISOString() : undefined,
        paymentMethod: paymentMethod === '' ? undefined : (paymentMethod as 'Efectivo' | 'Transferencia' | undefined),
        sortOrder,
        status,
        page: pageNumber,
        perPage: perPage,
    });

    const sortOptions = [
        { value: 'date_desc', label: 'Fecha: más reciente' },
        { value: 'date_asc', label: 'Fecha: más antigua' },
        { value: 'price_asc', label: 'Precio: menor a mayor' },
        { value: 'price_desc', label: 'Precio: mayor a menor' },
        { value: 'id_asc', label: 'ID: menor a mayor' },
        { value: 'id_desc', label: 'ID: mayor a menor' },
    ];

    return (
        <div>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-2">
                <div className="flex flex-col lg:flex-row justify-between gap-2 xl:gap-4 w-full lg:w-3/4">
                    <Filters
                        withSort
                        sortOrder={sortOrder}
                        baseSortOptions={sortOptions}
                        withDateRange
                        startDate={startDate}
                        endDate={endDate}
                        withStatus
                        selectedStatus={status}
                    />
                </div>
                <Link
                    href="/admin/sells/new"
                    className="self-end border border-border font-semibold bg-surface hover:bg-border-dark rounded-md px-4 py-2 transition-all"
                >
                    Registrar nueva venta
                </Link>
            </div>

            <div className="mt-4 lg:mt-8">
                <SellsTable initialSells={initialSells} totalCount={total} sortOrder={sortOrder} perPage={perPage} />
            </div>
        </div>
    );
}
