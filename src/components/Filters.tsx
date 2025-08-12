'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { format } from '@formkit/tempo';

import { Category } from '@/generated/prisma';
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
}: FiltersProps) {
    const router = useRouter();
    const pathname = usePathname();

    const categoriesOptions = useMemo(() => {
        if (!withCategories) return [];

        const options = Object.entries(Category).map(([key, value]) => ({
            value: key,
            label: value.replace('_', ' '),
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

    const [search, setSearch] = useState(searchProp ?? '');
    const [selectedCategory, setSelectedCategory] = useState(selectedCategoryProp ?? '');
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

    useEffect(() => {
        const timeout = setTimeout(() => {
            const queryParams = {
                ...(withSearch ? { search } : {}),
                ...(withCategories ? { filterByCategory: selectedCategory } : {}),
                ...(withSort && sortOrder ? { sortOrder } : {}),
                ...(withDateRange && dateRange[0] ? { startDate: format(dateRange[0], 'YYYY-MM-DD', 'en') } : {}),
                ...(withDateRange && dateRange[1] ? { endDate: format(dateRange[1], 'YYYY-MM-DD', 'en') } : {}),
            };

            const queryString = buildQueryParams(queryParams);

            router.replace(`${pathname}${queryString ? '?' + queryString : ''}`);
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
    ]);

    return (
        <>
            {withSearch && <Search placeholder={searchPlaceholder} value={search} setValue={setSearch} />}

            {withCategories && (
                <div className="w-full xl:min-w-56 ">
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
                <div className="w-full xl:min-w-56">
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
                <CustomDatePicker
                    mode="range"
                    value={dateRange}
                    onChange={setDateRange}
                    customPlaceholder="Filtrar por fechas"
                />
            )}
        </>
    );
}
