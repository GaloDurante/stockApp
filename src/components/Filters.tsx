'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { format } from '@formkit/tempo';

import { Category, SaleStatus } from '@/generated/prisma';
import { OptionType } from '@/types/form';

import { getSelectedOption, buildQueryParams } from '@/lib/helpers/utils';

import CustomSelect from '@/components/CustomSelect';
import Search from '@/components/Search';
import CustomDatePicker from '@/components/CustomDatePicker';

interface FiltersProps {
    withSearch?: boolean;
    search?: string;
    searchPlaceholder?: string;
    withCategories?: boolean;
    showAllCategory?: boolean;
    selectedCategory?: string;
    withSort?: boolean;
    sortOrder?: string;
    baseSortOptions?: { value: string; label: string }[];
    withDateRange?: boolean;
    startDate?: string;
    endDate?: string;
    withOrder?: boolean;
    orderOptions?: [string, string, string, string];
    withStatus?: boolean;
    selectedStatus?: string;
}

export default function Filters({
    withSearch = false,
    search: searchProp,
    searchPlaceholder,
    withCategories = false,
    showAllCategory = false,
    selectedCategory: selectedCategoryProp,
    withSort = false,
    sortOrder: sortOrderProp,
    baseSortOptions,
    withDateRange = false,
    startDate,
    endDate,
    withOrder = false,
    orderOptions,
    withStatus = false,
    selectedStatus: selectedStatusProp,
}: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();

    const categoriesOptions = useMemo(() => {
        if (!withCategories) return [];

        const options = Object.entries(Category).map(([key, value]) => ({
            value: key,
            label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace('_', ' '),
        }));

        if (showAllCategory) {
            options.unshift({
                value: '',
                label: 'Todas las categorías',
            });
        }
        return options;
    }, [withCategories, showAllCategory]);

    const sortOrderOptions = useMemo(() => {
        if (!withSort) return null;
        return baseSortOptions;
    }, [withSort, baseSortOptions]);

    const statusOptions = useMemo(() => {
        if (!withStatus) return [];

        const options = Object.entries(SaleStatus).map(([key, value]) => ({
            value: key,
            label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase().replace('_', ' '),
        }));

        return options;
    }, [withStatus]);

    const [search, setSearch] = useState(searchProp ?? '');
    const [selectedCategory, setSelectedCategory] = useState(selectedCategoryProp ?? '');
    const [selectedStatus, setSelectedStatus] = useState(selectedStatusProp ?? '');

    const [sortOrder, setSortOrder] = useState<string | undefined>(withSort ? (sortOrderProp ?? 'asc') : undefined);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null,
    ]);

    const selectedCategoryOption = useMemo(() => {
        if (!withCategories || !categoriesOptions) return null;
        return getSelectedOption(categoriesOptions, selectedCategory ?? null);
    }, [withCategories, selectedCategory, categoriesOptions]);

    const selectedSortOrderOption = useMemo(() => {
        if (!withSort || !sortOrderOptions) return null;
        return getSelectedOption(sortOrderOptions, sortOrder ?? null);
    }, [withSort, sortOrder, sortOrderOptions]);

    const selectedStatusOption = useMemo(() => {
        if (!withStatus || !statusOptions) return null;
        return getSelectedOption(statusOptions, selectedStatus ?? null);
    }, [withStatus, selectedStatus, statusOptions]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const queryParams = {
                ...(withSearch ? { search } : {}),
                ...(withCategories ? { filterByCategory: selectedCategory } : {}),
                ...(withSort && sortOrder ? { sortOrder } : {}),
                ...(withDateRange && dateRange[0] ? { startDate: format(dateRange[0], 'YYYY-MM-DD', 'en') } : {}),
                ...(withDateRange && dateRange[1] ? { endDate: format(dateRange[1], 'YYYY-MM-DD', 'en') } : {}),
                ...(withStatus ? { status: selectedStatus } : {}),
            };

            const queryString = buildQueryParams(queryParams);

            router.replace(`${pathname}${queryString ? '?' + queryString : ''}`, { scroll: false });
        }, 300);

        return () => clearTimeout(timeout);
    }, [
        search,
        selectedCategory,
        sortOrder,
        pathname,
        router,
        withSearch,
        withCategories,
        withSort,
        withDateRange,
        dateRange,
        withStatus,
        selectedStatus,
    ]);

    return (
        <>
            {withSearch && <Search placeholder={searchPlaceholder} value={search} setValue={setSearch} />}

            {withCategories && (
                <div className={`w-full xl:min-w-56 ${withOrder && orderOptions ? orderOptions[0] : ''}`}>
                    <CustomSelect
                        value={selectedCategoryOption}
                        options={categoriesOptions}
                        onChange={(newValue) => {
                            setSelectedCategory((newValue as OptionType | null)?.value ?? '');
                        }}
                        instanceId="category"
                    />
                </div>
            )}

            {withSort && sortOrderOptions && (
                <div className={`w-full xl:min-w-56 ${withOrder && orderOptions ? orderOptions[1] : ''}`}>
                    <CustomSelect
                        value={selectedSortOrderOption}
                        options={sortOrderOptions}
                        instanceId="sortorder"
                        onChange={(option) => {
                            const value = (option as OptionType)?.value;
                            setSortOrder(value as 'asc' | 'desc' | 'price_asc' | 'price_desc');
                        }}
                    />
                </div>
            )}

            {withDateRange && (
                <div className={`w-full ${withOrder && orderOptions ? orderOptions[2] : ''}`}>
                    <CustomDatePicker
                        mode="range"
                        value={dateRange}
                        onChange={setDateRange}
                        customPlaceholder="Filtrar por fechas"
                    />
                </div>
            )}

            {withStatus && (
                <div className={`w-full xl:min-w-56 ${withOrder && orderOptions ? orderOptions[3] : ''}`}>
                    <CustomSelect
                        value={selectedStatusOption}
                        options={statusOptions}
                        instanceId="status"
                        onChange={(newValue) => {
                            setSelectedStatus((newValue as OptionType | null)?.value ?? '');
                        }}
                    />
                </div>
            )}
        </>
    );
}
