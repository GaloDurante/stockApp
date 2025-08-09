'use client';

import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';

interface CustomDatePickerProps {
    dateRange: [Date | null, Date | null];
    setDateRange: (dateRange: [Date | null, Date | null]) => void;
    customPlaceholder?: string;
}

export default function CustomDatePicker({
    dateRange,
    setDateRange,
    customPlaceholder = 'Selecciona un rango de fechas',
}: CustomDatePickerProps) {
    const [startDate, endDate] = dateRange;

    return (
        <div className="flex flex-col w-full">
            <DatePicker
                closeOnScroll={true}
                showIcon
                icon={<Calendar />}
                toggleCalendarOnIconClick
                selectsRange
                dateFormat="dd/MM/yyyy"
                dropdownMode="select"
                startDate={startDate}
                endDate={endDate}
                onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
                isClearable
                placeholderText={customPlaceholder}
                className="bg-surface px-8! py-2.5! border rounded-md border-border focus:outline-none focus:ring-1 focus:ring-gray-200 w-full"
            />
        </div>
    );
}
