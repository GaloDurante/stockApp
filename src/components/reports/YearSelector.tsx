'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { OptionType } from '@/types/form';
import { getSelectedOption } from '@/lib/helpers/utils';
import { LoaderCircle } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';

interface YearSelectorProps {
    currentYear: number;
    maxYear: number;
}

export default function YearSelector({ currentYear, maxYear }: YearSelectorProps) {
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const minYear = 2023;
    const options = useMemo(
        () =>
            Array.from({ length: maxYear - minYear + 1 }, (_, i) => {
                const year = maxYear - i;
                return { value: String(year), label: String(year) };
            }),
        [minYear, maxYear]
    );

    const selectedOption = useMemo(() => {
        return getSelectedOption(options, String(currentYear) ?? null);
    }, [options, currentYear]);

    if (!isClient) {
        return (
            <div className="flex items-center justify-center h-[46px]">
                <LoaderCircle className="animate-spin" />
            </div>
        );
    }

    return (
        <CustomSelect
            instanceId="year-selector"
            value={selectedOption}
            options={options}
            onChange={(option) => {
                if (!option) return;
                const value = (option as OptionType)?.value;
                router.push(`?year=${value}`);
            }}
        />
    );
}
