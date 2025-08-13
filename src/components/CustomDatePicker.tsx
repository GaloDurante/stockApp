'use client';

import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';

interface RangePickerProps {
    mode: 'range';
    value: [Date | null, Date | null];
    onChange: (value: [Date | null, Date | null]) => void;
    customPlaceholder?: string;
    isError?: boolean;
}
interface SinglePickerProps {
    mode: 'single';
    value: Date | null;
    onChange: (value: Date | null) => void;
    customPlaceholder?: string;
    isError?: boolean;
}

type CustomDatePickerProps = RangePickerProps | SinglePickerProps;

export default function CustomDatePicker({
    mode,
    value,
    onChange,
    customPlaceholder,
    isError = false,
}: CustomDatePickerProps) {
    return (
        <div className="flex flex-col w-full">
            <DatePicker
                closeOnScroll
                showIcon
                icon={<Calendar />}
                toggleCalendarOnIconClick
                {...(mode === 'range'
                    ? {
                          selectsRange: true,
                          startDate: value[0],
                          endDate: value[1],
                          onChange: (dates: [Date | null, Date | null]) => onChange(dates),
                      }
                    : {
                          selected: value,
                          onChange: (date: Date | null) => onChange(date),
                      })}
                dateFormat="dd/MM/yyyy"
                dropdownMode="select"
                isClearable
                placeholderText={customPlaceholder}
                className={`bg-surface px-8! py-2.5! transition-all border focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200 rounded-md w-full ${isError ? 'border-red-700' : 'border-border'}`}
            />
        </div>
    );
}
