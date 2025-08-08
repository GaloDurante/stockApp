import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { OptionType } from '@/types/form';

import Select from 'react-select';

interface CustomSelectProps {
    value: OptionType | OptionType[] | null;
    options: OptionType[];
    onChange: (newValue: SingleValue<OptionType> | MultiValue<OptionType>, actionMeta: ActionMeta<OptionType>) => void;
    instanceId: string;
    isDisabled?: boolean;
    isMulti?: boolean;
    placeholder?: string;
    isError?: boolean;
    isLoading?: boolean;
    menuPlacement?: 'auto' | 'bottom' | 'top';
}

export default function CustomSelect({
    value,
    options,
    instanceId,
    onChange,
    isDisabled,
    isMulti = false,
    placeholder,
    isError = false,
    isLoading = false,
    menuPlacement = 'auto',
}: CustomSelectProps) {
    return (
        <Select
            instanceId={`filters-select-${instanceId}`}
            value={value}
            options={options}
            isDisabled={isDisabled}
            isMulti={isMulti}
            placeholder={placeholder}
            closeMenuOnSelect={!isMulti}
            menuPlacement={menuPlacement}
            isLoading={isLoading}
            onChange={onChange}
            unstyled
            classNames={{
                control: ({ isFocused, isDisabled }) => {
                    const baseClasses = `${isDisabled && 'opacity-30'} rounded-md bg-surface border py-2 pl-4 pr-2 flex gap-1 focus-within:ring-1 focus-within:ring-border`;
                    const borderColor = isError
                        ? 'border-red-700 focus-within:ring-red-700 focus-within:border-red-700'
                        : isFocused
                          ? 'border-gray-300'
                          : 'border-border';
                    return `${baseClasses} ${borderColor}`;
                },
                menu: () => 'z-50 rounded-md shadow-lg bg-surface mt-2 border border-gray-300 overflow-hidden',
                option: ({ isFocused, isSelected, isDisabled }) =>
                    `cursor-pointer select-none px-4 py-2 ${isDisabled ? 'opacity-30' : ''} ${
                        isFocused || isSelected ? 'bg-border' : ''
                    }`,
                multiValue: () => 'bg-border text-border rounded-full px-2 py-1 flex items-center text-sm',
                multiValueLabel: () => 'text-white pr-1 truncate',
                valueContainer: () => 'flex gap-1',
                multiValueRemove: () =>
                    'pl-1 text-white hover:text-red-800 hover:bg-red-100 rounded-full p-1 cursor-pointer',
                singleValue: () => 'truncate',
                input: () => 'text-white cursor-pointer',
                dropdownIndicator: () =>
                    'text-neutral-500 mx-1 p-1 rounded-full cursor-pointer hover:bg-border transition-all',
                indicatorSeparator: () => 'bg-gray-300',
                clearIndicator: () => 'text-neutral-500 mx-1 p-1 rounded-full hover:bg-border cursor-pointer',
                loadingIndicator: () => 'mr-3! text-neutral-500',
            }}
        />
    );
}
