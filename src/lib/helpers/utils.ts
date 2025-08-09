export function mapOptions<T>(
    items: T[],
    getValue: (item: T) => string,
    getLabel: (item: T) => string,
    includeAllOption = false,
    allLabel = 'Todas'
) {
    const mapped = items.map((item) => ({
        value: getValue(item),
        label: getLabel(item),
    }));

    if (includeAllOption) {
        return [{ value: '', label: allLabel }, ...mapped];
    }

    return mapped;
}

export function getSelectedOption(options: { value: string; label: string }[], selectedValue: string | null) {
    return options.find((o) => o.value === selectedValue) ?? null;
}

export function buildQueryParams(params: Record<string, string | undefined>) {
    const query = new URLSearchParams();
    for (const key in params) {
        const value = params[key];
        if (value) query.set(key, value);
    }
    return query.toString();
}
