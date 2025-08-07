interface SearchPropsType {
    placeholder?: string;
    value: string;
    setValue: (newValue: string) => void;
}

export default function Search({ placeholder = 'Buscar...', value, setValue }: SearchPropsType) {
    return (
        <>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-surface px-4 py-2 border rounded-md border-border focus:outline-none focus:ring-1 focus:ring-gray-200 w-full xl:min-w-56"
            />
        </>
    );
}
